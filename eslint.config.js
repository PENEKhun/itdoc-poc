import globals from "globals";
import pluginJest from "eslint-plugin-jest";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

/** @type {import("eslint").Linter.Config[]} */
export default [
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    ignores: ["**/tests/**"],
  },
  {
    ignores: ["**/db/migrations/**", "**/db/seeds/**"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.js"],
    plugins: {
      jest: pluginJest,
      unicorn: eslintPluginUnicorn,
    },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "space-in-parens": ["error", "never"],
      "eol-last": ["error", "always"],
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
      "import/no-dynamic-require": "error",
      "import/no-absolute-path": "error",
      "import/no-self-import": "error",
      "import/no-commonjs": "error",
      "no-unused-vars": "off",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "import/order": [
        "error",
        {
          groups: ["builtin", ["sibling", "parent"], "index", "object"],
        },
      ],
      camelcase: ["error", { properties: "always" }], // 변수, 함수명
      "new-cap": ["error", { newIsCap: true, capIsNew: false }], // 클래스명
      "unicorn/filename-case": [
        // 파일명
        "error",
        {
          case: "kebabCase",
        },
      ],
    },
  },
  {
    files: ["src/**/*.js"],
    rules: {
      "no-console": "error",
    },
  },
];
