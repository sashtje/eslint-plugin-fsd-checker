/**
 * @fileoverview Makes sure that imports satisfy the FSD architecture and that underlying layers do not import overlying ones
 * @author sashtje
 */
"use strict";

const rule = require("../../../lib/rules/layer-imports"),
  RuleTester = require("eslint").RuleTester;

const aliasOptions = [{alias: '@'}];

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});
ruleTester.run("layer-imports", rule, {
  valid: [
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\features\\Article',
      code: "import { addComment, addForm } from '@/shared/Button.tsx'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\features\\Article',
      code: "import { addComment, addForm } from '@/entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\app\\providers',
      code: "import { addComment, addForm } from '@/widgets/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\widgets\\pages',
      code: "import { useLocation } from 'react-router-dom'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\index.tsx',
      code: "import { StoreProvider } from '@/app/providers/StoreProvider'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\entities\\Article.tsx',
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: [
        {
          alias: '@',
          ignoreImport: ['**/StoreProvider']
        }
      ],
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\shared\\Article.tsx',
      code: "import { StateSchema } from '@/shared/providers/StoreProvider'",
      errors: [],
      options: aliasOptions,
    }
  ],

  invalid: [
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\entities\\providers',
      code: "import { addComment, addForm } from '@/features/Article.tsx'",
      errors: [{ message: "A layer can only import underlying layers: entities, shared" }],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\features\\providers',
      code: "import { addComment, addForm } from '@/widgets/Article.tsx'",
      errors: [{ message: "A layer can only import underlying layers: entities, shared" }],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Desktop\\javascript\\production-project\\src\\entities\\providers',
      code: "import { addComment, addForm } from '@/widgets/Article.tsx'",
      errors: [{ message: "A layer can only import underlying layers: entities, shared" }],
      options: aliasOptions,
    }
  ],
});
