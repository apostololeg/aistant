import path from 'path';

const src = path.resolve('src/');
const build = path.resolve('build/');

export default {
  src,
  build,
  assets: path.resolve(src, 'assets/'),
  modules: path.resolve('node_modules'),
};
