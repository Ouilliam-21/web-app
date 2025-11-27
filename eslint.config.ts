import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default defineConfig([
  {
    ignores: [
      ".nuxt/**",
      "app/components/ui/**",
      "node_modules/**",
      "eslint.config.ts",
      "tsconfig.json",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js, "simple-import-sort": simpleImportSort },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "prefer-const": ["error", {
          "destructuring": "any",
          "ignoreReadBeforeAssign": false
      }],
    },
  },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  {
    rules: {
      "vue/multi-word-component-names":"off"
    },
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
]);
