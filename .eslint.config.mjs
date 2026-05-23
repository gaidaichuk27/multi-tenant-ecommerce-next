import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const lintConfig = [
    ...compat.config({
        extends: [
            'next/core-web-vitals',
            'plugin:@typescript-eslint/recommended',
            'prettier',
        ],

        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
            '@typescript-eslint/prefer-as-const': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',

            'react-hooks/exhaustive-deps': 'off',

            'no-empty-pattern': 'off',
            'no-unused-vars': 'off',

            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
        },

        settings: {
            react: {
                version: 'detect',
            },
        },
    }),
];

export default lintConfig;
