const { Strategy, ExtractJwt } = require('passport-jwt');
const { config } = require('../config.js');

const User = require('../schemas/user-schema');

exports.applyPassportStrategy = (passport) => {
    const options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = config.passport.secret;

    passport.use(
        new Strategy(options, (payload, done) => {
            User.findOne({ email: payload.email }, (err, user) => {
                if(err) return done(err, false);
                if(user) {
                    return done(null, {
                        email: user.email,
                        _id: user._id
                    });
                }

                return done(null, false);
            })
        })
    );
};