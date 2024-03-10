/* eslint-env node */

module.exports = {
    root: true,
    extends: [
      'eslint:recommended',
      'airbnb',
      'airbnb-typescript/base',
      'prettier',
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      project: './tsconfig.eslint.json',
      tsconfigRootDir: __dirname,
    },
    rules: {
      'import/extensions': 'off',
      'import/no-extraneous-dependencies': 'off',

      "no-console": "off",
        "no-restricted-syntax": [
            "error",
            {
                "selector": "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
                "message": "Unexpected property on console object was called"
            }
        ],

      'no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],

      'import/prefer-default-export': 'off',
    },
  }