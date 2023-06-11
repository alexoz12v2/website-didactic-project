"use strict";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { config } from "dotenv";
config();

passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: "/auth/google/callback",
	},
	// TODO serializzazione al database
	(accessToken, refreshToken, profile, /*cb*/done) => {
		done(null, profile);
	}
));


