"use strict";
import { Router } from "express";
import passport from "passport";
import { config } from "dotenv";
config();

const router = Router();

// queste 2 usate nel CLIENT, con useEffect, dove se c'e stata buona authenticazione mandi i dati dello user al client
router.get("/login/failed", (req, res) => {
	// status not authenticated
	res.status(401).json({
		success: false,
		message: "failed to authenticate",
	});
});

router.get("/login/success", (req, res) => {
	// se user autenticato. alias per req.session.user
	if (req.user) {
		res.status(200).json({
			success: true,
			message: "successful authentication",
			user: req.user,
			// cookies: req.cookies,
		});
	}
});

router.get("/logout", (req, res, next) => {
	req.logout(err => {
		if (err) { return next(err); }
		res.redirect(process.env.FRONTEND_URL);
	});
});

// -------------------------- google routes -----------------------------------
// dovrebbe essere post se usi forms con post
router.get("/google", passport.authenticate("google", {
	scope: ["profile"],
}));

// url a cui sei rediretto dopo accesso google, configurato da oauth20
router.get("/google/callback", passport.authenticate("google", {
	successRedirect: process.env.FRONTEND_URL, // vai a homepage di client
	failureRedirect: "/login/failed",
}));

// -------------------------- github routes -----------------------------------
// duplica le routes per le altre passport strategies
router.get("/github", passport.authenticate("github", {
	scope: ["profile"],
}));

router.get("/github/callback", passport.authenticate("github", {
	successRedirect: process.env.FRONTEND_URL, // vai a homepage di client
	failureRedirect: "/login/failed",
}));

export default router;