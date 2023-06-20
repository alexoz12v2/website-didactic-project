"use strict";
import { Router } from "express";
import passport from "passport";
import { config } from "dotenv";
config();
import multer, { diskStorage } from "multer";

import { publicKey } from "../keypair.js";
import { 
	createUser, 
	sendUser, 
	decryptTextDataUser, 
	uploadAvatarUser 
} from "../controllers/user.js";

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
// TODO se ce la fai col tempo scrivi una custom "MongoStorage", per non fare che prima li salvi
// su disco e poi su MongoDB
const storage = diskStorage({
	// function which determines where the files should be stored
	destination: (req, file, cb) => {
		cb(null, `./tmp/images`);
	},
	// function to determine what the file should be named
	filename: (req, file, cb) => {
		const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // from docs
		cb(null, file.fieldname + "-" + suffix);
	},
});

const imageFilter = (req, file, cb) => {
	if (file.mimetype.includes("image"))
		cb(null, true);
	else
		cb(null, false);
};

const upload = multer({
	storage: storage,
	fileFilter: imageFilter,
});

router.post("/login", 
	upload.single("avatar"), // TODO remove, in register text fields in req.body, image in req.file
	decryptTextDataUser,
	uploadAvatarUser, // TODO remove, put in register
	passport.authenticate("local", {
		successRedirect: "/auth/login/success", // non va diretto al frontend perche res.redirect + withCredentials(axios) = true non funziona, perche in richieste redirected tutti gli headers (inclusi i cors) sono rimossi, fallendo la GET alla homepage per cors
		failureRedirect: "/auth/login/failed",
		failureMessage: true,
	}),
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
