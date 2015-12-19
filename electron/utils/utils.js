var fs = require('fs');

module.exports.write = function (filePath, data) {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  fs.writeFileSync(filePath, data);
};

module.exports.save = function (name, obj) {
  localStorage.setItem(name, obj);
};

module.exports.get = function (name) {
  return JSON.parse(localStorage.getItem(name));
};

module.exports.lowerCaseProps = function (obj) {
  var newObj = {};
  for (var key in obj) {
    newObj[key.toLowerCase()] = obj[key];
  }
  return newObj;
};