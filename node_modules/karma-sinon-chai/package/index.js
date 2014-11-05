var path = require('path');

var pattern = function(file) {
  return {pattern: file, included: true, served: true, watched: false};
};

var framework = function(files) {
  files.unshift(pattern(path.join(__dirname, 'adapter.js')));
  files.unshift(pattern(path.resolve(require.resolve('sinon-chai'))));
  files.unshift(pattern(path.resolve(require.resolve('chai'), '../chai.js')));
  // TODO is there a bower api for resolving paths?
  files.unshift(pattern(path.join(__dirname, 'bower_components/sinonjs/sinon.js')));
};

framework.$inject = ['config.files'];
module.exports = {'framework:sinon-chai': ['factory', framework]};
