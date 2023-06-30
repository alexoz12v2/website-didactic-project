"use strict";
import express from "express";
import mongoose, { Types } from "mongoose";
import { config } from "dotenv";
config();
//import nodemailer from "nodemailer";
import { privateDecrypt, constants as cryptoConstants } from "crypto";
import { open } from "fs/promises";

//import mailData from "../maildata.js";
import { privateKey } from "../keypair.js";
import User from "../models/user.js";

const getFriends = async (email) => {
	console.log(email);
	const user = await User.findByUsername(email);
	if (!user)
		throw new Error(`Couldn't find any user with email ${email}`);
	
	console.log("friend list ids");
	console.log(user.friends);
	const friendsDisplayData = [];
	for (const index in user.friends)
	{
		const friend = await User.findById(new Types.ObjectId(user.friends[index]));
		if (!friend)
			throw new Error(`Couldn't find any user with email ${email}`);

		friendsDisplayData.push({ 
			name: friend.name,
			email: friend.email,
			avatarURL: `${process.env.BACKEND_URL}:${process.env.PORT}/api/image/${user.avatar.id}`,
		});
	}
	return friendsDisplayData;
}

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
	//const key = {
	//	key: privateKey,
	//	passphrase: process.env.KEY_PASS,
	//};

	//const userData = privateDecrypt(req.body.data, key);
	
	console.log("///////////////////////////////////////////////////////////////////////////");
	console.log(req.body);
	// aggiunta da passport-local-mongoose. TODO avatar
	try {
		await User.register(new User({
			email: req.body.email,
			name: { first: req.body.nome, last: req.body.cognome },
			friends: [],
		}), req.body.password);
	} catch(err) {
		console.error(err);
		next(err);
	}
	next();
};

export const sendUser = async (req, res, next) => {
	// se user autenticato. req.user alias per req.session.user
	if (!req.session.passport?.user) {
		res.status(200).json({ // TODO se non loggato va bene status OK?
			success: true,
			message: "not authenticated",
			user: null,
		});
	}

	try {
		const user = await User.findOne({ email: req.session.passport.user });
		if (!user) {
			res.status(404).json({
				success: false,
				message: "failed to authenticate",
			});
			return;
		}

		// popola amici
		const friendsDisplayData = await getFriends(user.email);
		
		// genera csrfToken (cookie con nome "csrfToken"), usato nel frontend state
		// lo mette in automatico in res.cookie
		const csrfToken = req.csrfToken();
		res.status(200).json({
			success: true,
			message: "successful authentication",
			user: {
				name: user.name,
				email: user.email,
				//avatar: "https://wallpapers.com/images/featured/87h46gcobjl5e4xu.jpg", // TODO
				avatar: `${process.env.BACKEND_URL}:${process.env.PORT}/api/image/${user.avatar.id}`,
				friends: friendsDisplayData,
			},
			token: csrfToken,
		});
	} catch(err) {
		next(err);
	}
};

const oauthCommonCallback = async(firstName, lastName, email/*, avatar*/, done) => {
//	const transporter = nodemailer.createTransport({
//		port: 465, // default
//		host: "smtp.gmail.com",
//		auth: {
//			user: mailData.email,
//			pass: mailData.password,
//		},
//		secure: true,
//	});

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

		//await transporter.sendMail({
		//	from: mailData.email,
		//	to: email,
		//	subject: "Buddy Buzz automatic registration password",
		//	text: `your automatically generated password is ${password}`,
		//});
		
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
	oauthCommonCallback(profile.username, "", profile.emails[0].value, cb);
}

export const uploadAvatarUser = async (req, res, next) => {
	// leggi copia temporanea da disco e salvala su Mongo. essa e' presente in req.file se
	// multer.upload.single("avatar") middleware e' stata inserita
	let imageHandle;
	try {	
		console.log("fdsokafjkslafhdslsdjkafhjdksfhdjklsafhdjksafh");
		imageHandle = await open(`${req.file.path}`, "r");
		const { buffer } = await imageHandle.read();
		console.log("buffer read:");
		console.log(buffer);
		const userDoc = await User.findByUsername(req.body.email);
		if (!userDoc)
			throw new Error(`UploadAvatarUser: User ${req.body.email} doesn't exists`);

		userDoc.avatar = {
			id: new Types.ObjectId(),
			data: buffer,
			byteCount: req.file.size,
			contentType: req.file.mimetype,
		};
		await userDoc.save();
		next();
	} catch (err) {
		next(err);
	} finally {
		await imageHandle?.close();
	}
};

export const decryptTextDataUser = (req, res, next) => {
	console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
	const key = { 
		key: privateKey, 
		padding: cryptoConstants.RSA_PKCS1_OAEP_PADDING,
		//padding: cryptoConstants.RSA_NO_PADDING,
		oaepHash: 'sha256', 
	};
	const decryptedData = privateDecrypt(key, Buffer.from(req.body.encryptedText, "base64"));
	// decode buffer in [{"name":"username","value":"<unknown>"},{"name":"password","value":"<unknown>"},{"name":"login","value":"Login"}] and remove the login button
	const decryptedObj = JSON.parse(decryptedData.toString("utf-8"));
	console.log(decryptedObj);
	if (decryptedObj.forEach)
	{
		decryptedObj.forEach(elem => {
			req.body[elem.name] = elem.value;
		});
	}
	else
	{
		req.body = {
			...req.body,
			...decryptedObj,
		};
	}
	delete req.body.encryptedText;

	//res.set('Access-Control-Allow-Origin', 'https://localhost:3000'); <-- setting headers before a redirect doesn't work
	next();
};

export const findByAvatarIdUser = async (id) => {
	const user = await User.findOne({"avatar.id": id});
	if (!(user?.avatar?.data))
		throw new Error("Image not found");
	return user;
};

export const decryptEmail = (req, res, next) => {
	console.log("2222222222222222222222222222222222222222222222222222222222");
	const key = { 
		key: privateKey, 
		padding: cryptoConstants.RSA_PKCS1_OAEP_PADDING,
		oaepHash: 'sha256', 
	};

	const decryptedData = privateDecrypt(key, Buffer.from(req.query.v, "base64"));

	const decryptedObj = JSON.parse(decryptedData.toString("utf-8"));
	req.body.email = decryptedObj;

	next();
};

export const sendFriend = async (req, res, next) => {
	try {
		const user = await User.findByUsername(req.body.email);
		if (!user)
			throw new Error(`Couldn't find any user with email ${req.body.email}`);

		const csrfToken = req.csrfToken();
		res.status(200).json({
			name: user.name,
			avatarURL:`${process.env.BACKEND_URL}:${process.env.PORT}/api/image/${user.avatar.id}`,
			token: csrfToken,
		});
	} catch (err) {
		res.status(404).json({
			message: "non esiste",
		});
	}
};

export const addFriend = async (req, res, next) => {
	try {
		console.log("ggggggggggggggggggggggggggggggggggggggggggggggggggggggg");
		console.log(req.body);
		const user = await User.findByUsername(req.body.userEmail);
		if (!user)
			throw new Error(`Couldn't find any user with email ${req.body.email}`);
		
		const friend = await User.findByUsername(req.body.friendEmail);
		if (!friend)
			throw new Error(`Couldn't find any user with email ${req.body.email}`);

		user.friends.push(friend._id);
		await user.save();

		friend.friends.push(user._id);
		await friend.save();

		res.status(200).json({
			message: "friend added",
		});
	} catch (err) {
		next(err);
	}
};

export const sendFriends = async (req, res, next) => {
	try {
		console.log("6666666666666666666666666666666666666666666666666666666666666666666666666666");
		console.log(req.body.email);
		const friendsDisplayData = await getFriends(req.body.email);
		console.log(friendsDisplayData);
		const csrfToken = req.csrfToken();
		res.status(200).json({
			friends: friendsDisplayData,
			token: csrfToken,
		});
	} catch (err) {
		next(err);
	}
};

export const removeFriend = async (req, res, next) => {
	try {
		const user = await User.findByUsername(req.body.userEmail);
		if (!user)
			throw new Error(`Couldn't find any user with email ${req.body.email}`);
		
		const index = user.friends.findIndex(async (friendID) => {
			const friend = await User.findById(friendID);
			if (!friend)
				throw new Error(`Couldn't find any user with email ${req.body.email}`);

			return friend.email !== req.body.friendEmail;
		});

		user.friends.splice(index, 1);
		console.log(user.friends)
		await user.save();
		res.status(200).json({
			message: "removed",
		});
	} catch (err) {
		next(err);
	}
};
