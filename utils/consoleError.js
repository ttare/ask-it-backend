const APIError = require('./apiError');

const _error = console.error;
console.error = (...args) => {
  return new Promise((resolve, reject) => {
    _error(...args);
    resolve(new APIError("Error on server", 1000));
  });
};
