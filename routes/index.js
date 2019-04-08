const path = require('path');
const fs = require('fs');

const upperFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

module.exports = function (app, express, passport, catchError) {
  const controllers = require('../controllers');
  fs.readdirSync(__dirname)
    .filter((filename) => filename !== 'index.js')
    .forEach((file) => {
      const name = file.replace('.js', '');
      const controller = controllers[`${upperFirstLetter(name.trim())}Controller`];
      const router = express.Router();
      require(`./${name.trim()}`)({router, passport, catchError, controller});
      app.use(`/api/${name.trim()}`, router);
    });
};
