import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    define: {
      'process.env': {},
      // Force development mode for specific libraries
      __DEV__: true,
      // Add global constants that might be used by libraries
      global: 'globalThis',
    },
    plugins: [reactRefresh(), nodePolyfills()],
    build: {
      target: ['es2020', 'chrome90', 'firefox90', 'safari15'],
      minify: false, // Disable minification completely
      sourcemap: true, // Enable sourcemaps to help debug issues
      commonjsOptions: {
        transformMixedEsModules: true, // Handle mixed ES/CommonJS modules
        include: [/node_modules/], // Process all node_modules
      },
      rollupOptions: {
        external: [], // Don't exclude any dependencies
        output: {
          format: 'es',
          manualChunks: (id) => {
            // More granular chunking strategy
            if (id.includes('node_modules')) {
              if (id.includes('viem') || id.includes('ethers') || id.includes('wagmi')) {
                return 'web3';
              }
              if (id.includes('react') || id.includes('scheduler')) {
                return 'react';
              }
              if (id.includes('framer-motion') || id.includes('react-hot-toast') ||
                id.includes('react-icons') || id.includes('react-calendar')) {
                return 'ui';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        keepNames: true,
        define: {
          global: 'globalThis'
        }
      },
      include: ['ethers', 'viem', 'wagmi'] // Explicitly include problematic dependencies
    }
  };
});
