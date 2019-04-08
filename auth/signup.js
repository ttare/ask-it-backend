const LocalStrategy = require("passport-local").Strategy;
const db = require("../db");

module.exports = function (passport) {
  passport.use('signup', new LocalStrategy({
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      try {
        const exist = await db.User.count({where: {username: username.trim().toLowerCase()}});
        if (!!exist) {
          return done();
        }

        let user = db.User.build({
          username: username.trim().toLowerCase(),
          name: req.body.name,
        });
        user.salt = user.makeSalt(16);
        user.password = await user.encryptPassword(password);

        user = await user.save();
        done(null, {id: user.id});
      } catch (ex) {
        console.error(ex).then(done);
      }
    })
  );
};
