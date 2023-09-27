/**
 * @fileoverview checks imports for only using public api
 * @author sashtje
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const {PUBLIC_ERROR, TESTING_PUBLIC_ERROR} = require("../../../lib/const/const");

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
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice';",
      errors: [{ messageId: PUBLIC_ERROR }],
      output: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article';"
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice';",
      errors: [{ messageId: PUBLIC_ERROR }],
      options: aliasOptions,
      output: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article';"
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\entities\\Article\\file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing';",
      errors: [{ messageId: TESTING_PUBLIC_ERROR }],
      options: [{
        alias: '@',
        testFiles: []
      }],
      output: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article';"
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\entities\\Article\\file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.tsx';",
      errors: [{ messageId: PUBLIC_ERROR }],
      options: [{
        alias: '@',
        testFiles: ['**/*.test.ts', '**/*.test.tsx']
      }],
      output: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing';"
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\entities\\Article\\file.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing';",
      errors: [{ messageId: TESTING_PUBLIC_ERROR }],
      options: [{
        alias: '@',
        testFiles: ['**/*.test.ts', '**/*.test.tsx']
      }],
      output: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article';"
    },
  ],
});
