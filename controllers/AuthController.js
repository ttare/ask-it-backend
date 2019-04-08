const passport = require('passport');
const APIError = require('../utils/apiError');
const MESSAGES = require('../utils/messages');

class AuthController {
  static async login(req, res, next) {
    passport.authenticate('jwt-local', function (err, user) {
      if (err)
        return console.error(err).then(x => res.status(500).json(x));

      if (!user)
        return res.status(401).json(new APIError(MESSAGES.incorrectEmailOrPassword(), 1000));

      return res.json(user);
    })(req, res, next);
  }

  static async signup(req, res, next) {
    passport.authenticate('signup', async (err, user, info) => {
      if (err)
        return console.error(err).then(x => res.status(500).json(x));

      if (user === false) {
        return res.status(400).json(new APIError(MESSAGES.userAlreadyExist(), 1000));
      }

      return res.json(user);
    })(req, res, next);
  }
}

module.exports = AuthController;
