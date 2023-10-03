/**
 * @fileoverview feature sliced relative path checker
 * @author sashtje
 */
"use strict";

const { RELATIVE_PATH_ERROR } = require("../const/const");
const path = require('path');
const { isPathRelative } = require('../helpers');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced relative path checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    messages: {
      [RELATIVE_PATH_ERROR]: 'Within one slice, paths must be relative',
    },
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ], // Add a schema if the rule has options
  },

  create(context) {
    // website to test AST: https://astexplorer.net/
    const alias = context.options[0]?.alias || '';

    return {
      ImportDeclaration(node) {
        // example @/entities/Article
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        // example C:\Users\...\production_project\src\entities\Article
        const fromFilename = context.getFilename();

        if (shouldBeRelative(fromFilename, importTo)) {
          context.report({
            node,
            messageId: RELATIVE_PATH_ERROR,
            fix: fixer => {
              const normalizedPath = getNormalizedCurrentFilePath(fromFilename)
                  .split('/')
                  .slice(0, -1)
                  .join('/');

              let relativePath = path.relative(normalizedPath, `/${importTo}`)
                  .split(/\\|\//)
                  .join('/');
              if (!relativePath.startsWith('.')) {
                relativePath = './' + relativePath;
              }

              return fixer.replaceText(node.source, `'${relativePath}'`);
            }
          });
        }
      }
    };
  },
};

const layers = {
  'pages': 'pages',
  'widgets': 'widgets',
  'features': 'features',
  'entities': 'entities',
  'shared': 'shared',
}

function getNormalizedCurrentFilePath(currentFilePath) {
  const normalizedPath = path.toNamespacedPath(currentFilePath);
  if (normalizedPath.includes('src')) {
    const fromPath = normalizedPath.split('src')[1];
    return fromPath.split(/\\|\//).join('/');
  }
  return normalizedPath.split(/\\|\//).join('/');
}

// examples
// from: C:\Users\...\production_project\src\entities\Article
// to: @/entities/Article
function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }

  const toArray = to.split('/');
  const toLayer = toArray[0];
  const toSlice = toArray[1];

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const fromPath = getNormalizedCurrentFilePath(from);
  const fromArray = fromPath.split('/');
  if (fromArray[0]) {
    return false;
  }
  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && fromLayer === toLayer;
}
