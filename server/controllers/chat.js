"use strict";
import express from "express";
import mongoose from "mongoose";
import { privateDecrypt, constants as cryptoConstants } from "crypto";

import Chat from "../models/chat.js";
import User from "../models/user.js";
import { privateKey } from "../keypair.js";

export const createNewChat = async (user1, user2) => {
	return await Chat.create({ id: [ user1._id, user2._id ], messages: new Array() })
}

//{from: email, to: recipient, msg: msg} <= req.body
export const createMessage = async (req, res, next) => {
	console.log("received request");
	try {
		console.log(`req.body.from: ${req.body.from}`);
		console.log(`req.body.to: ${req.body.to}`);

		const sender = await User.findByUsername(req.body.from);
		const receiver = await User.findByUsername(req.body.to);
		console.log(sender); console.log(receiver);
		if (!sender || !receiver) {
			console.log("throwing error");
			throw new Error("couldn't find sender or receiver");
		}

		let index = 0;
		let chat = await Chat.findOne({ id: [ sender._id, receiver._id ] });
		
		if (!chat) {
			chat = await Chat.findOne({ id: [ receiver._id, sender._id ] });
			index = 1;
		}

		if (!chat) {
			console.log("didn't find any existing chat, creating new...");
			chat = createNewChat(sender, receiver);
			index = 0;
		}

		chat.messages.push({
			authorIndex: index,
			content: req.body.msg,
			dateSent: Date.now(),
		});

		await chat.save();

		res.status(200).json(chat.messages[chat.messages.length - 1].content);
	} catch (error) {
		console.error(error);
		res.status(404).json({message: error.message});
	}
};

// TODO refactor
export const decryptData = (req, res, next) => {
	const key = { 
		key: privateKey, 
		padding: cryptoConstants.RSA_PKCS1_OAEP_PADDING,
		oaepHash: 'sha256', 
	};

	const decryptedData = privateDecrypt(key, Buffer.from(req.query.v, "base64"));

	// { email1, email2 }
	const decryptedObj = JSON.parse(decryptedData.toString("utf-8"));
	req.body.emails = decryptedObj;

	next();
};

export const getMessages = async (req, res, next) => {
	const { email1, email2 } = req.body.emails;
	const user1 = await User.findByUsername(email1);
	const user2 = await User.findByUsername(email2);
	const chat = await Chat.findOne().or([
		{ id: [ user1._id, user2._id ] },
		{ id: [ user2._id, user1._id ] },
	]);

	console.log(chat);
	console.log(chat.messages);
	console.log(!chat.messages);
	console.log(!(chat.messages))
	if (!chat || !(chat?.messages)) {
		return res.status(404).json({
			success: false,
			message: `couldn't find chat between ${email1} and ${email2}`,
		});
	}

	console.log(chat.messages.map(elem => elem.content));
	res.status(200).json(chat.messages.map(elem => elem.content));
};

