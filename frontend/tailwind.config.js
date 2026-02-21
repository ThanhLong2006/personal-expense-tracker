/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Màu sắc chủ đạo
      colors: {
        primary: {
          DEFAULT: '#FFFFFF', // trắng chính
          dark: '#FFFFFF',  // đen cho chế độ tối
          light: '#FFFFFF',    // trắng nhạt
        },
        accent: {
          DEFAULT: '#F59E0B',  // Vàng cam cho cảnh báo
        },
        background: {
          light: '#FFFFFF',
          dark: '#FFFFFF',
        },
        text: {
          primary: '#00C4B4',
          secondary: '#64748B',
        },
      },
      // Bo góc 24px
      borderRadius: {
        'xl': '24px',
      },
      // Font chữ
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#FFFFFF",
          "primary-focus": "#ffffff",
          "primary-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
        },
        dark: {
          "primary": "#00C4B4",
          "primary-focus": "#4DD0E1",
          "primary-content": "#ffffff",
          "base-100": "#0F172A",
          "base-200": "#1E293B",
          "base-300": "#334155",
        },
      },
    ],
    darkTheme: "light",
  },
}

