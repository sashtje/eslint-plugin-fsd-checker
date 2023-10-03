/**
 * @fileoverview feature sliced relative path checker
 * @author sashtje
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;
const {RELATIVE_PATH_ERROR} = require("../../../lib/const/const");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});
ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
  ],

  invalid: [
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\entities\\Article\\ui\\Component.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ messageId: RELATIVE_PATH_ERROR }],
      output: "import { addCommentFormActions, addCommentFormReducer } from '../model/slices/addCommentFormSlice'",
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\entities\\Article\\ui\\Component.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ messageId: RELATIVE_PATH_ERROR }],
      options: [{alias: '@'}],
      output: "import { addCommentFormActions, addCommentFormReducer } from '../model/slices/addCommentFormSlice'"
    },
  ],
});
