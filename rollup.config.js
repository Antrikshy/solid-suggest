import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  external: ['solid-js', 'solid-js/web'],
  output: [
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    typescript({
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src'
    })
  ]
}
