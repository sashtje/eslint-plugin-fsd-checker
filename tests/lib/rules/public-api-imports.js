/**
 * @fileoverview checks imports for only using public api
 * @author sashtje
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const aliasOptions = [{alias: '@'}];

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});
ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\entities\\Article\\file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: [{
       alias: '@',
       testFiles: ['**/*.test.ts', '**/*.test.tsx']
      }]
    }
  ],

  invalid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: "Absolute import is only allowed from Public API (index.ts or testing.ts)" }],
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: "Absolute import is only allowed from Public API (index.ts or testing.ts)" }],
      options: aliasOptions
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\entities\\Article\\file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [{ message: "This data must be imported from Public API (index.ts)" }],
      options: [{
        alias: '@',
        testFiles: []
      }]
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\entities\\Article\\file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.tsx'",
      errors: [{ message: "Absolute import is only allowed from Public API (index.ts or testing.ts)" }],
      options: [{
        alias: '@',
        testFiles: ['**/*.test.ts', '**/*.test.tsx']
      }]
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\entities\\Article\\file.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [{ message: "This data must be imported from Public API (index.ts)" }],
      options: [{
        alias: '@',
        testFiles: ['**/*.test.ts', '**/*.test.tsx']
      }]
    },
  ],
});
