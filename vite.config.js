import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    define: {
      'process.env': {}
    },
    plugins: [reactRefresh(), nodePolyfills()],
    build: {
      target: ['es2020', 'chrome90', 'firefox90', 'safari15'],
      minify: 'terser',
      terserOptions: {
        keep_classnames: true,
        keep_fnames: true,
        mangle: {
          keep_fnames: true,
          keep_classnames: true
        },
        compress: {
          keep_fnames: true,
          keep_classnames: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              'react',
              'react-dom',
              'react-router-dom',
              'ethers',
              'viem',
              'wagmi'
            ],
            ui: [
              'framer-motion',
              'react-hot-toast',
              'react-icons',
              'react-calendar'
            ]
          }
        }
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        keepNames: true
      }
    }
  };
});
