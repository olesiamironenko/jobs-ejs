import js from "@eslint/js";
import globals from "globals";
import { prettier } from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ['**/*.js'],
    ignores: ['node_modules', 'dist', 'build', 'coverage'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },

    rules: {
      ...js.configs.recommended.rules,

      // Backend best practices
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'eqeqeq': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'consistent-return': 'error',
    },
  },

  // Disable formatting conflicts
  prettier,
]);
