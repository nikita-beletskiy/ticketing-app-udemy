// Fixes issue with file change detection when running inside of a Docker container
module.exports = {
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300;
    return config;
  }
};
