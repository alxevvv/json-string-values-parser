module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
  },
  plugins: ["@typescript-eslint", "prettier", "simple-import-sort"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-console": "warn",
    "no-unused-vars": "off",
    quotes: ["warn", "double", { avoidEscape: true }],
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
    "prettier/prettier": "warn",
  },
};
