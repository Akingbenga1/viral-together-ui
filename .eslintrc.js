module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Enforce design system compliance
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/bg-blue-/]',
        message: 'Use primary-* colors instead of blue-* for brand consistency. Check .cursorule for approved colors.',
      },
      {
        selector: 'Literal[value=/bg-purple-/]',
        message: 'Use secondary-* colors instead of purple-* for brand consistency. Check .cursorule for approved colors.',
      },
      {
        selector: 'Literal[value=/text-blue-/]',
        message: 'Use primary-* colors instead of blue-* for brand consistency. Check .cursorule for approved colors.',
      },
      {
        selector: 'Literal[value=/text-purple-/]',
        message: 'Use secondary-* colors instead of purple-* for brand consistency. Check .cursorule for approved colors.',
      },
    ],
    // Warn about hardcoded spacing that should use Tailwind scale
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'Literal[value=/p-[^1-9]|m-[^1-9]|px-[^1-9]|py-[^1-9]|mx-[^1-9]|my-[^1-9]/]',
        message: 'Use Tailwind spacing scale (4, 6, 8, 12, 16, 20) as defined in .cursorule',
      },
    ],
  },
  overrides: [
    {
      files: ['src/components/**/*.{ts,tsx}'],
      rules: {
        // Enforce component naming conventions
        'react/function-component-definition': [
          'error',
          {
            namedComponents: 'arrow-function',
            unnamedComponents: 'arrow-function',
          },
        ],
      },
    },
  ],
}; 