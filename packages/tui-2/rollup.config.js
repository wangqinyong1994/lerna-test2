import nodeResolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from '@rollup/plugin-replace'
import typescript from 'rollup-plugin-typescript2'
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
    input: 'components/index.ts',
    output: {
      file: 'lib/tui2.js',
      format: 'cjs',
      indent: false
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
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
    ],
  },

  // ES
  {
    input: 'components/index.ts',
    output: {
      file: 'es/tui2.js',
      format: 'es',
      indent: false
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
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
    ],
  },

  // ES for Browsers
  {
    input: 'components/index.ts',
    output: {
      file: 'es/tui2.mjs',
      format: 'es',
      indent: false
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
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
    ],
  },

  // UMD Development
  {
    input: 'components/index.ts',
    output: {
      file: 'dist/tui2.js',
      format: 'umd',
      name: 'tui2',
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
    ],
  },

  // UMD Production
  {
    input: 'components/index.ts',
    output: {
      file: 'dist/tui2.min.js',
      format: 'umd',
      name: 'tui2',
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
    ],
  },
]
