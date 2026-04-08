import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.playwright-browsers/**', 'test-results/**']
  },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}', 'tests/**/*.js', 'scripts/**/*.mjs', 'playwright*.js', 'vite.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    rules: {
      'react/react-in-jsx-scope': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['src/react/**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': 'off'
    }
  },
  {
    files: ['src/js/main.js'],
    rules: {
      'no-unused-vars': 'off'
    }
  }
];
