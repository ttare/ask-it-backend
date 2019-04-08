const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');

const { DB } = process.configuration;
let db = {
  sequelize: new Sequelize(DB.database, DB.username, DB.password, DB),
  Sequelize
};

fs.readdirSync(__dirname)
  .filter((filename) => filename !== 'index.js')
  .forEach((file) => {
    const model = db.sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((model) => {
  if ('associate' in db[model]) {
    db[model].associate(db);
  }
});

module.exports = db;
