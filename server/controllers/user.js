"use strict";
import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
config();
import nodemailer from "nodemailer";
import { privateDecrypt } from "crypto";

import mailData from "../maildata.js";
import { privateKey } from "../keypair.js";
import User from "../models/user.js";

export const getUsers = async (req, res) => {
	try {
		const users = await User.find();

		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({message: error.message});
	}
};

export const createUser = async (req, res, next) => {
	// TODO req.body.data dovrebbe essere creato dal form
	const key = {
		key: privateKey,
		passphrase: process.env.KEY_PASS,
	};

	const userData = privateDecrypt(req.body.data, key);
	console.log("registering user");
	// aggiunta da passport-local-mongoose. TODO avatar
	try {
		await User.register(new User({
			email: userData.email,
			name: { first: userData.firstName, last: req.body.lastName },
			friends: [],
		}), userData.password);

		res.redirect(process.env.FRONTEND_URL);
	} catch(err) {
		console.error(err);
		next(err);
	}
};

export const sendUser = async (req, res, next) => {
	// se user autenticato. req.user alias per req.session.user
	console.log(req.session);
	if (req.session.passport?.user) {
		try {
			const user = await User.findOne({ email: req.session.passport.user });
			if (!user) {
				res.status(404).json({
					success: false,
					message: "failed to authenticate",
				});
				return;
			}
			
			console.log(req.session);
			console.log("------------------------------------------------------");
			// genera csrfToken (cookie con nome "csrfToken"), usato nel frontend state
			// lo mette in automatico in res.cookie
			req.csrfToken();
			console.log(res);
			res.status(200).json({
				success: true,
				message: "successful authentication",
				user: {
					name: user.name,
					email: user.email,
					avatar: "https://wallpapers.com/images/featured/87h46gcobjl5e4xu.jpg", // TODO
					friends: user.friends,
				},
			});
		} catch(err) {
			next(err);
		}
	} else {
		res.status(200).json({ // TODO se non loggato va bene status OK?
			success: true,
			message: "not authenticated",
			user: null,
		});
	}
};

const oauthCommonCallback = async(firstName, lastName, email/*, avatar*/, done) => {
	const transporter = nodemailer.createTransport({
		port: 465, // default
		host: "smtp.gmail.com",
		auth: {
			user: mailData.email,
			pass: mailData.password,
		},
		secure: true,
	});

	const length = 10;
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	// accedi o crea nuovo account nel database con password casuale
	try {
		const user = await User.findOne({email: email});
		if (user) {
			done(null, user);
			return;
		}

		let password = "";
		for (let i = 0; i < length; i++) {
			password += characters.charAt(Math.floor(Math.random() * characters.length));
		}

		const userDoc = new User({
			email: email,
			name: { first: firstName, last: lastName, },
			friends: [],
		});

		await transporter.sendMail({
			from: mailData.email,
			to: email,
			subject: "Buddy Buzz automatic registration password",
			text: `your automatically generated password is ${password}`, // TODO secure??
		});
		
		// metodo register passato da mongoose
		await User.register(userDoc, password);

		done(null, user);
	} catch (err) {
		done(err, null);
	}
}

export const oauthGoogleStrategyCallbackUser = async (accessToken, refreshToken, profile, cb) => {
	oauthCommonCallback(profile.name.givenName, profile.name.familyName, profile.emails[0].value, cb);
}

export const oauthGitHubStrategyCallbackUser = async (accessToken, refreshToken, profile, cb) => {
	console.log(profile);
	oauthCommonCallback(profile.username, "", profile.emails[0].value, cb);
}
