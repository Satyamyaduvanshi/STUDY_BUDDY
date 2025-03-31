import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotevn from "dotenv"

dotevn.config();

const BE_URL = process.env.BE_URL || "";

if(!BE_URL){
  throw new Error("Please set the environment variable BE_URL")
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `${BE_URL}`, 
        changeOrigin: true,
        secure: false,
      },
    },
  },
});