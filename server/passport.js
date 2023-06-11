"use strict";
import "./strategies/google.js";
import "./strategies/github.js";
import passport from "passport";

// serializza e deserializza user, in quanto usiamo sessions e' necessario mantenere lo stato
passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

