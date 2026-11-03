import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// BASE_PATH задаёт подпапку сайта, например "/master-kafel-site/" для
// GitHub Pages (выставляется в .github/workflows/deploy.yml).
// Локально и на собственном домене — корень "/".
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
})
