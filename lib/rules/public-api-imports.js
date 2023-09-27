/**
 * @fileoverview checks imports for only using public api
 * @author sashtje
 */
"use strict";

const {PUBLIC_ERROR, TESTING_PUBLIC_ERROR} = require("../const/const");
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
    fixable: 'code', // Or `code` or `whitespace`
    messages: {
      [PUBLIC_ERROR]: 'Absolute import is only allowed from Public API (index.ts or testing.ts)',
      [TESTING_PUBLIC_ERROR]: 'This data must be imported from Public API (index.ts)',
    },
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
    const { alias = '', testFiles = [] } = context.options[0] || {};
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
        const slice = segments[1];

        if (!allowedLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        const isImportFromPublicApi = segments.length === 2;
        const isTestingPublicApi = segments[2] === 'testing' && segments.length === 3;

        const currentFilePath = context.getFilename();

        const isCurrentFileTesting = testFiles.some(pattern => micromatch.isMatch(currentFilePath, pattern));

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          if (segments[2] === 'testing' && isCurrentFileTesting) {
            context.report({
              node,
              messageId: PUBLIC_ERROR,
              fix: (fixer) => {
                return fixer.replaceText(node.source, alias ? `'${alias}/${layer}/${slice}/testing'` : `'${layer}/${slice}/testing'`);
              }
            });
          } else {
            context.report({
              node,
              messageId: PUBLIC_ERROR,
              fix: (fixer) => {
                return fixer.replaceText(node.source, alias ? `'${alias}/${layer}/${slice}'` : `'${layer}/${slice}'`);
              }
            });
          }
        }

        if (isTestingPublicApi && !isCurrentFileTesting) {
            context.report({
              node,
              messageId: TESTING_PUBLIC_ERROR,
              fix: (fixer) => {
                return fixer.replaceText(node.source, alias ? `'${alias}/${layer}/${slice}'` : `'${layer}/${slice}'`);
              }
            });
        }

        if (isImportFromPublicApi && isCurrentFileTesting) {
          context.report({
            node,
            messageId: PUBLIC_ERROR,
            fix: (fixer) => {
              return fixer.replaceText(node.source, alias ? `'${alias}/${layer}/${slice}/testing'` : `'${layer}/${slice}/testing'`);
            }
          });
        }
      }
    };
  },
};
