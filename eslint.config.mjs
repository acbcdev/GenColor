import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
const filename = fileURLToPath(import.meta.url)
const dir = dirname(filename)

const compat = new FlatCompat({
  baseDirectory: dir
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  eslintConfigPrettier,
  {
    rules: {
      'comma-dangle': ['error', 'never'],
      semi: ['error', 'never'],
      'react-hooks/exhaustive-deps': 'off',
      'func-call-spacing': ['error', 'never'],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      indent: ['error', 2],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-loop-func': 'error',
      'no-eval': 'error',
      'prefer-template': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'error',
      'space-infix-ops': 'error',
      'keyword-spacing': 'error',
      'comma-spacing': ['error', { before: false, after: true }],
      quotes: ['error', 'single'],
      'jsx-quotes': ['error', 'prefer-single'],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]

export default eslintConfig
