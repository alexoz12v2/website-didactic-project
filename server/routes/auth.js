"use strict";
import { Router } from "express";
import passport from "passport";
import { config } from "dotenv";
config();
import { privateDecrypt, constants as cryptoConstants } from "crypto";
import { publicKey, privateKey } from "../keypair.js";

import { createUser, sendUser } from "../controllers/user.js";

const router = Router();

// queste 2 usate nel CLIENT, con useEffect, dove se c'e stata buona authenticazione mandi i dati dello user al client
router.get("/login/failed", (req, res) => {
	// status not authenticated
	res.status(404).json({
		success: false,
		message: "failed to authenticate",
	});
});

router.get("/login/success", sendUser);

router.get("/logout", (req, res, next) => {
	req.logout(err => { // settata da passport. Rimuove cookie inserito da passport
		if (err) { return next(err); }
		req.session = null; // TODO oppure req.session.destroy(callback)
		res.clearCookie("csrfToken");
		res.clearCookie("session");
		res.redirect(process.env.FRONTEND_URL);
	});
});

// -------------------------- google routes -----------------------------------
// dovrebbe essere post se usi forms con post
router.get("/google", passport.authenticate("google", {
	scope: ["email","profile"],
}));

// url a cui sei rediretto dopo accesso google, configurato da oauth20
router.get("/google/callback", passport.authenticate("google", {
	successRedirect: process.env.FRONTEND_URL, // vai a homepage di client
	failureRedirect: "/auth/login/failed",
}));

// -------------------------- github routes -----------------------------------
// duplica le routes per le altre passport strategies
router.get("/github", passport.authenticate("github", {
	scope: ["user:email","profile"],
}));

router.get("/github/callback", passport.authenticate("github", {
	successRedirect: process.env.FRONTEND_URL,
	failureRedirect: "/auth/login/failed",
}));

// ------------------------- local routes -------------------------------------
router.post("/login", 
	(req, res, next) => {
		const key = { 
			key: privateKey, 
			padding: cryptoConstants.RSA_PKCS1_OAEP_PADDING,
			//padding: cryptoConstants.RSA_NO_PADDING,
			oaepHash: 'sha256', 
		};
		const decryptedData = privateDecrypt(key, Buffer.from(req.body.b64data, "base64"));
		// decode buffer in [{"name":"username","value":"<unknown>"},{"name":"password","value":"<unknown>"},{"name":"login","value":"Login"}] and remove the login button
		const decryptedObj = JSON.parse(decryptedData.toString("utf-8"));
		decryptedObj.pop();
		decryptedObj.forEach(elem => {
			req.body[elem.name] = elem.value;
		});
		delete req.body.b64data;
		console.log(req.body);

		//res.set('Access-Control-Allow-Origin', 'https://localhost:3000'); <-- setting headers before a redirect doesn't work
		next();
	},
	passport.authenticate("local", {
		successRedirect: "/auth/login/success", // non va diretto al frontend perche res.redirect + withCredentials(axios) = true non funziona, perche in richieste redirected tutti gli headers (inclusi i cors) sono rimossi, fallendo la GET alla homepage per cors
		failureRedirect: "/auth/login/failed",
		failureMessage: true,
	})
);

router.post("/register", createUser);

router.get("/register/nonce", (req, res, next) => {
	res.status(200).json({ 
		success: true,
		message: "Cryptographics nonce sent",
		nonce: publicKey,
	});
})

export default router;
