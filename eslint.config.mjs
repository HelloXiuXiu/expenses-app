import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import reactPlugin from 'eslint-plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
      // enforce self-closing JSX components when possible
      'react/self-closing-comp': ['error', {
          component: true,
          html: true,
        }
      ]
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    }
  }
]

export default eslintConfig
