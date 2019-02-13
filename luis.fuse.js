const { FuseBox, WebIndexPlugin, ImageBase64Plugin, JSONPlugin } = require('fuse-box');
const JsxControlsPlugin = require('jsx-controls-loader').fuseBoxPlugin;

const { SnapshotPlugin } = require('luis/dist/bridges/jest/snapshot_plugin');

module.exports = function(root, entry) {
  const fuse = FuseBox.init({
    homeDir: root,
    target: 'browser@es6',
    output: '../../luis/$name.js',
    plugins: [
      WebIndexPlugin({ template: 'index.html', target: 'index.html' }),
      JsxControlsPlugin,
      ImageBase64Plugin(),
      JSONPlugin(),
      SnapshotPlugin()
    ],
    sourceMaps: true
  });

  fuse.dev({ port: 9001, fallback: true });

  fuse
    .bundle('vendor')
    // Watching (to add dependencies) it's damn fast anyway
    // first bundle will get HMR related code injected
    .instructions(` ~ ${entry}`); // nothing has changed here

  fuse
    .bundle('app')
    .instructions(` !> [${entry}]`)
    .hmr()
    .watch();
  fuse.run();
};
