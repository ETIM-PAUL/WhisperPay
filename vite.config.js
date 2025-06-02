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
      target: ['es2020', 'chrome90', 'firefox90', 'safari15'],
      minify: 'terser', // Change from esbuild to terser
      terserOptions: {
        keep_classnames: true,
        keep_fnames: true
      }
    },
  };
});