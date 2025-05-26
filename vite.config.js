import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, '/src') }],
  },
  plugins: [reactRefresh()],
  build: {
    target: ['es2020', 'chrome90', 'firefox90', 'safari15'], // Updated targets to support BigInt
  },
});