"use strict";

import { Router } from "express";

import { findByAvatarIdUser } from "../controllers/user.js";

const router = new Router();

router.get("/image/:id", async (req, res, next) => {
	const imageID = req.params.id;
	try {
		const user = await findByAvatarIdUser(imageID);
		console.log(user.avatar.data);
		console.log(user.avatar.contentType);
		const { data, contentType } = user.avatar;
		res.set("Content-Type", contentType);
		res.send(data);
	} catch (err) {
		if (err.message === "Image not found") {
			return res.status(404).json({
				success: false,
				message: "Image not found",
			});
		}
		next(err);
	}
});

router.get("/token", (req, res) => {
	const token = req.csrfToken();
	res.status(200).json({
		token: token,
	});
})

export default router;
