import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }], // Fixed path (removed leading slash)
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
          manualChunks: undefined,
          preserveModules: true,
          preserveModulesRoot: 'src'
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
