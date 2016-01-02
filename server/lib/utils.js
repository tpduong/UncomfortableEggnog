var Promise = require('bluebird');
var fs = require('fs');
var writeFile = Promise.promisify(fs.writeFile);
var mkpathAsync = Promise.promisify(require('mkpath'));
var del = require('del');

var writeSnippetFile = function (packageEntry, outFolder) {
  var body = JSON.stringify(packageEntry.packageContents);
  var fileName = escape(packageEntry.title) + '.json';
  var filePath = outFolder + fileName;
  return mkpathAsync(outFolder).then(function () {
    return writeFile(filePath, body, 'utf8')
      .then(function () {
        return {
         filePath: filePath,
         fileName: fileName
        };
      });
  });
};

var cleanFolder = function (folderPath) {
  return del(folderPath + '/**');
};

module.exports = {
  writeSnippetFile: writeSnippetFile,
  cleanFolder: cleanFolder
};