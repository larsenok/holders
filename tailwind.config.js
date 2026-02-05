export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        lootBurst: {
          '0%':   { transform: 'scale(0.8) translateY(10px)', opacity: '0' },
          '20%':  { transform: 'scale(1.05) translateY(-5px)', opacity: '1' },
          '70%':  { transform: 'scale(1.0) translateY(-10px)', opacity: '1' },
          '100%': { transform: 'scale(0.9) translateY(-20px)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4%)' },
          '75%': { transform: 'translateX(4%)' },
        },
      },
      animation: {
        'loot-burst': 'lootBurst 1.2s ease-out forwards',
        'shake': 'shake 0.3s ease-in-out',
      }
    },
  },
  plugins: [],
}
