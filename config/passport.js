const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

//load usser model;

const User = mongoose.model('users');

module.exports = async function(passport) {
  passport.use(
    await new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken);

        const newUser = {
          googleID: profile.id,
          lastName: profile.name.familyName,
          firstName: profile.name.givenName,
          email: profile.emails[0].value,
          image: profile.photos[0].value
        };


        // check for existing  User
        User.findOne({ googleID: profile.id }).then(user => {
          if (user) {
            done(null, user);
          } else {
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
};
