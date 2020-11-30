const Bundler = require('parcel-bundler');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'dist')

async function bundleServer() {
  console.log('Bundle SSR Server')
  // Single entrypoint file location:
  const entryFile = path.join(__dirname, 'src/server.tsx');

  const options = {
    target: 'node',

    outDir: OUT_DIR,
    outFile: 'server.js',
    watch: false,
    logLevel: 4,
  };

  const bundler = new Bundler(entryFile, options);
  await bundler.bundle();
}

async function bundleClient() {
  console.log('Bundle Client')
  // Single entrypoint file location:
  const entryFile = path.join(__dirname, 'src/index.tsx');

  const options = {
    target: 'browser',

    outDir: OUT_DIR,
    outFile: 'index.js',
    watch: false,
    logLevel: 4,
  };

  const bundler = new Bundler(entryFile, options);
  await bundler.bundle();
}

async function bundle() {
  await bundleServer()
  await bundleClient()
}


bundle()