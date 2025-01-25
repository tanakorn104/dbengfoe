import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
  
// })
export default defineConfig({
  plugins: [react()],
  // base: './', // ใช้เส้นทาง relative สำหรับ assets
  server:{
    https:{
      key:fs.readFileSync('./localhost.key'),
      cert:fs.readFileSync('./localhost.crt')
    },
    host:'localhost'
  }
})