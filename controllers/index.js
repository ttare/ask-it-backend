const fs = require('fs');
const path = require('path');

let controllers = {};
fs.readdirSync(__dirname)
  .forEach(function (file) {
    const fullPath = path.join(__dirname, file);
    if (file.indexOf('.') !== 0 && file !== 'index.js') {
      const Controller = require(fullPath);
      controllers[Controller.name] = Controller;
    }
});

module.exports = controllers;
