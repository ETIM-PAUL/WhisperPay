import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
const path = require('path');
import nodePolyfills from 'vite-plugin-node-stdlib-browser'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  return {
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, '/src') }],
    },
    define: {
      'process.env': {}
    },
    plugins: [reactRefresh(), nodePolyfills()],
    build: {
      target: ['es2020', 'chrome90', 'firefox90', 'safari15'], // Updated targets to support BigInt
    },
  };
});