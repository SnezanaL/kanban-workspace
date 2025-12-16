module.exports = {
  content: [
    './apps/kanban-signal/src/**/*.{html,ts}',
    './apps/kanban-ngxs/src/**/*.{html,ts}',
    './libs/shared/src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: '#6366F1',
          light: '#A5B4FC',
          dark: '#4F46E5',
        },
        // Accent
        accent: {
          DEFAULT: '#A5B4FC',
          light: '#C7D2FE',
        },
        // Success
        success: {
          DEFAULT: '#10D490',
          light: '#6EE7B7',
          dark: '#059669',
        },
        // Error/Danger
        error: {
          DEFAULT: '#EA5858',
          light: '#FF9898',
          dark: '#DC2626',
        },
        // Dark theme colors
        dark: {
          100: '#E4E8EB',
          200: '#747A83',
          300: '#3E4350',
          400: '#282C37',
          500: '#1A1D24',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
