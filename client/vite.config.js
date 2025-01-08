import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from 'fs'


// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // or true
    port: 443,
    https: {
      key: fs.readFileSync('private.key'),
      cert: fs.readFileSync('csr.pem'),
    },
  },
  plugins: [react()],
});
