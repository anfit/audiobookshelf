module.exports = {
  content: ['./components/**/*.{js,vue}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './nuxt.config.{js,ts}'],
  theme: {
    extend: {
      spacing: {
        '0.5e': '0.125em',
        '1e': '0.25em',
        '1.5e': '0.375em',
        '2e': '0.5em',
        '2.5e': '0.625em',
        '3e': '0.75em',
        '3.5e': '0.875em',
        '4e': '1em',
        '5e': '1.25em',
        '6e': '1.5em',
        '7e': '1.75em',
        '8e': '2em',
        '9e': '2.25em',
        '10e': '2.5em',
        '11e': '2.75em',
        '12e': '3em',
        '14e': '3.5em',
        '16e': '4em',
        '20e': '5em',
        '24e': '6em',
        '28e': '7em',
        '32e': '8em',
        '36e': '9em',
        '40e': '10em',
        '44e': '11em',
        '48e': '12em',
        '52e': '13em',
        '56e': '14em',
        '60e': '15em',
        '64e': '16em',
        '72e': '18em',
        '80e': '20em',
        '96e': '24em'
      },
      colors: {
        bg: '#373838',
        primary: '#232323',
        accent: '#1ad691',
        error: '#ff5252',
        info: '#2196f3',
        success: '#4caf50',
        warning: '#fb8c00',
        darkgreen: 'rgb(34, 127, 35)',
        black: {
          50: '#bbbbbb',
          100: '#666666',
          200: '#555555',
          300: '#444444',
          400: '#333333',
          500: '#222222',
          600: '#111111',
          700: '#101010'
        }
      },
      fontFamily: {
        sans: ['Source Sans Pro'],
        mono: ['Ubuntu Mono']
      },
      fontSize: {
        xxs: '0.625rem',
        '1.5xl': '1.375rem',
        '2.5xl': '1.6875rem',
        '4.5xl': '2.625rem'
      },
      zIndex: {
        5: '5',
        60: '60'
      }
    }
  }
}
