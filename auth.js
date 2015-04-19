var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	userSchema = require('./models/user');

passport.use(new LocalStrategy(userSchema.authenticate()));

passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

module.exports = passport;