"use strict";
import LocalStrategy from "passport-local";
import passport from "passport";
import User from "../models/user.js";

// Tolte per passare a passport-local-mongoose
//passport.use(new LocalStrategy(async (username, password, done) => {
//	console.log(`LocalStrategy called with ${username}, ${password}`);
//
//	try {
//		const user = await User.findOne()
//			.where("name.first").equals(username);
//
//		if (!user) {
//			throw new Error("No user found");
//			return;
//		}
//		
//		done(null, user);
//	} catch(err) {
//		done(err, null);
//	}
//}));
passport.use(new LocalStrategy({
	usernameField: "email",
	passwordField: "password",
}, User.authenticate()));
//passport.use(new LocalStrategy((username, password, cb) => {
//	console.log("strategy running");
//	console.log(`${username}, ${password}`);
//	cb(new Error(), null);
//}));
