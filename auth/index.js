const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const JWT = require('./jwt');
const signup = require('./signup');
const APIError = require('../utils/apiError');
const MESSAGES = require('../utils/messages');

module.exports = function (passport) {
  passport.isAuth = function (isPublic) {
    return async (req, res, next) => {
      if (!req.headers.authorization) {
        if (isPublic) {
          return next();
        } else {
          return res.status(401).json(new APIError(MESSAGES.unAuthorized(), 1000));
        }
      }

      passport.authenticate('jwt', {session: false})(req, res, function (err) {
        if (err)
          return res.status(500).json(err);

        next();
      });
    };
  };

  signup(passport);

  JWT(passport);
};

