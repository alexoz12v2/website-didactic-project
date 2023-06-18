"use strict";
import "./strategies/google.js";
import "./strategies/github.js";
import "./strategies/local.js";
import passport from "passport";
import User from "./models/user.js"

/*----------------------- rimosse per usare quelle date da passportLocalMongoose ------------*/
// serializza e deserializza user, in quanto usiamo sessions e' necessario mantenere lo stato
//passport.serializeUser((user, done) => {
//	// mette l'oggetto passato come secondo argomento in request.session.passport
//	done(null, user._id);
//});

//passport.deserializeUser((id, done) => {
//	User.findById(id)
//		.then(user => done(null, user))
//		.catch(err => done(err, null));
//});

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
