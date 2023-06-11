"use strict";
import { Strategy as GitHubStrategy } from "passport-github2";
import passport from "passport";
import { config } from "dotenv";
config();

passport.use(new GitHubStrategy({
		clientID: process.env.GITHUB_CLIENT_ID,
		clientSecret: process.env.GITHUB_CLIENT_SECRET,
		callbackURL: "/auth/github/callback",
	},
	// TODO serializzazione al database
	(accessToken, refreshToken, profile, /*cb*/done) => {
		done(null, profile);
	}
));
