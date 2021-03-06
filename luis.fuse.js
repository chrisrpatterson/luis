const {
  Sparky,
  FuseBox,
  JSONPlugin,
  CSSPlugin,
  CSSResourcePlugin,
  ImageBase64Plugin,
  EnvPlugin,
  WebIndexPlugin,
  UglifyJSPlugin,
  QuantumPlugin
} = require('fuse-box');

const StubPlugin = require('proxyrequire').FuseBoxStubPlugin(/\.tsx?/);
const SnapshotPlugin = require('./fuse-box/snapshot-plugin').SnapshotPlugin;

// console.log(require('path').resolve('src'));

module.exports = function(root, entry) {
  const home = require('path').resolve(root);

  const luisFuse = FuseBox.init({
    homeDir: home,
    output: 'public/$name.js',
    target: 'browser',
    sourceMaps: true,
    plugins: [
      SnapshotPlugin(),
      StubPlugin,
      ImageBase64Plugin(),
      JSONPlugin(),
      EnvPlugin({ NODE_ENV: 'test' }),
      CSSPlugin({
        group: 'luis.css',
        outFile: `public/styles/luis.css`,
        inject: false
      }),
      WebIndexPlugin({ template: 'index.html', target: 'index.html' })
    ]
  });

  luisFuse.dev({
    fallback: 'index.html',
    port: 9001
  });

  luisFuse.bundle('luis-vendor').instructions(` ~ ${entry}`); // nothing has changed here

  luisFuse
    .bundle('luis-client')
    .watch() // watch only client related code
    .hmr()
    .sourceMaps(true)
    .instructions(
      ` !> [${entry}] + proxyrequire + **/*.fixture.* + **/*.story.* + **/*.test.* + **/__fixtures__/* + **/__stories__/* + **/__tests__/* + **/tests/*`
    )
    .globals({
      proxyrequire: '*'
    });

  luisFuse.run();
};
