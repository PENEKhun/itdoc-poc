import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['lib/dsl/index.ts'],
  outDir: 'lib/build',
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
  dts: true,
  outExtension({ format }) {
    return format === 'esm' ? { js: '.mjs' } : { js: '.cjs' };
  },
  external: ['path', 'mocha', 'chai', 'jest'],
});
