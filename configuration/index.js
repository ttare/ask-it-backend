require("dotenv").config();

const configuration = {
  PORT: 3000,
  DB: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST_DOMAIN,
    port: process.env.DB_HOST_PORT,
    dialect: "postgres"
  },
  JWT: {
    secretOrKey: process.env.JWT_SECRET
  }
};

module.exports = process.env.DB_INIT ? configuration.DB : configuration;
