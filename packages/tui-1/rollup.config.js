import nodeResolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from '@rollup/plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import less from 'rollup-plugin-less'
import image from '@rollup/plugin-image'
import {
  terser
} from 'rollup-plugin-terser'

import pkg from './package.json'

const extensions = ['.ts', '.tsx', '.js', '.jsx']
const noDeclarationFiles = {
  compilerOptions: {
    declaration: false
  }
}

const babelRuntimeVersion = pkg.dependencies['@babel/runtime'].replace(
  /^[^0-9]*/,
  ''
)

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`)
  return (id) => pattern.test(id)
}

export default [
  // CommonJS
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/tui1.js',
      format: 'cjs',
      indent: false
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      less({
        insert: true
      }),
      nodeResolve({
        extensions,
      }),
      typescript({
        useTsconfigDeclarationDir: true
      }),
      babel({
        extensions,
        plugins: [
          ['@babel/plugin-transform-runtime', {
            version: babelRuntimeVersion
          }],
        ],
        runtimeHelpers: true,
      }),
      image(),
    ],
  },

  // ES
  {
    input: 'src/index.ts',
    output: {
      file: 'es/tui1.js',
      format: 'es',
      indent: false
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      less({
        insert: true
      }),
      nodeResolve({
        extensions,
      }),
      typescript({
        tsconfigOverride: noDeclarationFiles
      }),
      babel({
        extensions,
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            {
              version: babelRuntimeVersion,
              useESModules: true
            },
          ],
        ],
        runtimeHelpers: true,
      }),
      image(),
    ],
  },

  // ES for Browsers
  {
    input: 'src/index.ts',
    output: {
      file: 'es/tui1.mjs',
      format: 'es',
      indent: false
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      less({
        insert: true
      }),
      nodeResolve({
        extensions,
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      typescript({
        tsconfigOverride: noDeclarationFiles
      }),
      babel({
        extensions,
        exclude: 'node_modules/**',
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
      image(),
    ],
  },

  // UMD Development
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/tui1.js',
      format: 'umd',
      name: 'Tui1',
      indent: false,
      globals: {
        'react': 'React',
        'antd-mobile': 'antdMobile'
      }
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      less({
        insert: true
      }),
      nodeResolve({
        extensions,
      }),
      typescript({
        tsconfigOverride: noDeclarationFiles
      }),
      babel({
        extensions,
        exclude: 'node_modules/**',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      image(),
    ],
  },

  // UMD Production
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/tui1.min.js',
      format: 'umd',
      name: 'Tui1',
      indent: false,
      globals: {
        'react': 'React',
        'antd-mobile': 'antdMobile'
      }
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      less({
        insert: true
      }),
      nodeResolve({
        extensions,
      }),
      typescript({
        tsconfigOverride: noDeclarationFiles
      }),
      babel({
        extensions,
        exclude: 'node_modules/**',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
      image(),
    ],
  },
]
