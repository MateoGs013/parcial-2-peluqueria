/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        negro: '#0A0A0A',
        crema: '#F8F6F2',
        'rojo-faro': '#E60026',
        'azul-faro': '#0044CC',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      // Sombras "bruta": offset duro, blur 0. Es el sello visual del neo-brutalismo.
      boxShadow: {
        bruta: '6px 6px 0 0 #0A0A0A',
        'bruta-sm': '2px 2px 0 0 #0A0A0A',
        'bruta-lg': '10px 10px 0 0 #0A0A0A',
        'bruta-rojo': '6px 6px 0 0 #E60026',
        'bruta-azul': '6px 6px 0 0 #0044CC',
      },
      borderWidth: {
        3: '3px',
      },
      keyframes: {
        deslizar: {
          '0%': { transform: 'translateX(110%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        deslizar: 'deslizar 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
