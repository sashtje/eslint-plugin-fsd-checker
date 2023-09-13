/**
 * @fileoverview feature sliced relative path checker
 * @author sashtje
 */
"use strict";

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
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {

    // website to test AST: https://astexplorer.net/

    return {
      ImportDeclaration(node) {
        // example app/entities/Article
        const importTo = node.source.value;

        // example C:\Users\...\production_project\src\entities\Article
        const fromFilename = context.getFilename();

        context.report(node, 'Linter error!');
      }
    };
  },
};
