/**
 * @fileoverview Makes sure that imports satisfy the FSD architecture and that underlying layers do not import overlying ones
 * @author sashtje
 */
"use strict";

const micromatch = require('micromatch');
const path = require('path');
const { isPathRelative } = require('../helpers');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Makes sure that imports satisfy the FSD architecture and that underlying layers do not import overlying ones",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [{
      type: 'object',
      properties: {
        alias: {
          type: 'string',
        },
        ignoreImport: {
          type: 'array',
        }
      }
    }], // Add a schema if the rule has options
  },

  create(context) {
    const layers = {
      'app': ['pages', 'widgets', 'features', 'entities', 'shared'],
      'pages': ['widgets', 'features', 'entities', 'shared'],
      'widgets': ['features', 'entities', 'shared'],
      'features': ['entities', 'shared'],
      'entities': ['entities', 'shared'],
      'shared': ['shared'],
    };
    const availableLayers = {
      'app': 'app',
      'pages': 'pages',
      'widgets': 'widgets',
      'features': 'features',
      'entities': 'entities',
      'shared': 'shared',
    };

    const {alias = '', ignoreImport = []} = context.options[0] ?? {};

    const getCurrentFileLayer = () => {
      const currentFilePath = context.getFilename();

      const normalizedPath = path.toNamespacedPath(currentFilePath);
      const projectPath = normalizedPath?.split('src')[1];
      const segments = projectPath?.split(/\\|\//);

      return segments?.[1];
    };

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, '') : value;
      const segments = importPath?.split('/');

      return segments?.[0];
    };

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFileLayer = getCurrentFileLayer();
        const importLayer = getImportLayer(importPath);

        if (isPathRelative(importPath)) {
          return;
        }

        if (!availableLayers[importLayer] || !availableLayers[currentFileLayer]) {
          return;
        }

        const isIgnored = ignoreImport.some(pattern => {
          return micromatch.isMatch(importPath, pattern);
        })

        if (isIgnored) {
          return;
        }

        if (!layers[currentFileLayer]?.includes(importLayer)) {
          context.report(node, `A layer can only import underlying layers: ${layers[currentFileLayer].join(', ')}`);
        }
      }
    };
  },
};
