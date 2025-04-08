import { FlatCompat } from "@eslint/eslintrc";
import pluginQuery from "@tanstack/eslint-plugin-query"
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});
const eslintConfig = [
  ...pluginQuery.configs["flat/recommended"],
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-empty-interface": "off",
    },
  }),
];
export default eslintConfig;
