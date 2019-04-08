const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const db = require("../db");

const options =  {
  session: false,
  secretOrKey: process.configuration.JWT.secretOrKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function (passport) {
  passport.use(new JWTStrategy(options, async (payload, done) => {
    try {
      const user = await db.User.findOne({where: {id: payload.id}});

      if (!user)
        return done();

      return done(null, user);
    } catch (ex) {
      console.error(ex).then(done);
    }
  }));

  passport.use('jwt-local', new LocalStrategy({
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      try {
        if (!username || username === '')
          return done();

        const user = await db.User.findOne({where: {username: username.toLowerCase()}});
        if (!user)
          return done();

        const isValid = await user.validPassword(password);
        if (!isValid)
          return done();

        done(null, {token: `Bearer ${user.genereteAccessToken(process.configuration.JWT.secretOrKey)}`});
      } catch (ex) {
        console.error(ex).then(done);
      }
    }
  ));
};
