import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'

export default {
  input: 'src/index.tsx',
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
      rootDir: 'src',
      jsx: 'preserve',
      jsxImportSource: 'solid-js'
    }),
    babel({
      extensions: ['.ts', '.tsx'],
      babelHelpers: 'bundled',
      presets: [
        ['babel-preset-solid', {}],
        ['@babel/preset-typescript', {}]
      ],
      exclude: 'node_modules/**'
    })
  ]
}
