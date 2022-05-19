module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'prettier', 'import', 'simple-import-sort'],
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:import/typescript',
    ],
    root: true,
    env: {
        node: true,
    },
    rules: {
        'sort-imports': 0,
        'import-order': 0,
        'simple-import-sort/imports': 'error',
        'prettier/prettier': 2,
    },
};
