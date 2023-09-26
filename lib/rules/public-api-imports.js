/**
 * @fileoverview checks imports for only using public api
 * @author sashtje
 */
"use strict";

const micromatch = require('micromatch');
const { isPathRelative } = require('../helpers');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "checks imports for only using public api",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          },
          testFiles: {
            type: 'array'
          }
        }
      }
    ], // Add a schema if the rule has options
  },

  create(context) {
    const { alias, testFiles } = context.options[0] || { alias: '', testFiles: []};
    const allowedLayers = {
      'pages': 'pages',
      'widgets': 'widgets',
      'features': 'features',
      'entities': 'entities',
    }

    return {
      ImportDeclaration(node) {
        // example @/entities/Article
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        if (isPathRelative(importTo)) {
          return;
        }

        const segments = importTo.split('/');
        const layer = segments[0];

        if (!allowedLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        const isTestingPublicApi = segments[2] === 'testing' && segments.length === 3;

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report(node, 'Absolute import is only allowed from Public API (index.ts or testing.ts)');
        }

        if (isTestingPublicApi) {
          const currentFilePath = context.getFilename();

          const isCurrentFileTesting = testFiles.some(pattern => micromatch.isMatch(currentFilePath, pattern));

          if (!isCurrentFileTesting) {
            context.report(node, 'This data must be imported from Public API (index.ts)');
          }
        }
      }
    };
  },
};
