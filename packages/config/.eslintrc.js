module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended'
    ],
    plugins: ['prettier'],
    rules: {
        "prettier/prettier": ["error", {
            "semi": true,
            "trailingComma": "all",
            "singleQuote": true,
            "printWidth": 90,
            "tabWidth": 4
        }]
    },
};
