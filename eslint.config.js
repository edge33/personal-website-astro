import eslintPluginAstro from 'eslint-plugin-astro';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    // add more generic rule sets here, such as:
    // js.configs.recommended,
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...eslintPluginAstro.configs.recommended,
    ...eslintPluginAstro.configs['jsx-a11y-strict'],
    {
        rules: {
            'prefer-const': 'warn',
            // override/add rules settings here, such as:
            // "astro/no-set-html-directive": "error",
            '@typescript-eslint/no-unused-vars': [
                'warn', // or "error"
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },
    {
        ignores: ['dist/*', 'public/*'],
    },
];
