require("@rushstack/eslint-config/patch/modern-module-resolution")

module.exports = {
  extends: [
    "@rushstack/eslint-config/profile/node",
    "@rushstack/eslint-config/mixins/friendly-locals"
  ],
  plugins: ["simple-import-sort"],
  ignorePatterns: [".eslintrc.js", "lib", "test", "bin"],
  rules: {
    "@typescript-eslint/naming-convention": [
      "warn",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^I[A-Z]",
          "match": false,
        },
      },
    ],
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/no-parameter-properties": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "@rushstack/no-new-null": "off",
    "sort-imports": "off",
    "import/order": "off",
    "no-duplicate-imports": "off",
  },
  overrides: [
    {
      files: ["*/schemas/*.ts", "**/schemas.ts", "**/schema.ts"],
      rules: {
        "@typescript-eslint/typedef": "off",
      },
    },
  ],
}
