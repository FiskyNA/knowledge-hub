import eslint from '@typescript-eslint/eslint-plugin'
import tseslint from '@typescript-eslint/eslint-plugin'

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/', '.vite/'],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  }
)
