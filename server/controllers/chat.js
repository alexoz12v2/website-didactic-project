"use strict";
import express from "express";
import mongoose from "mongoose";

import ChatModel from "../models/chat.js";

export const getChats = async (req, res) => {
	try {
		const chats = await ChatModel.find();

		res.status(200).json(chats);
	} catch (error) {
		res.status(404).json({message: error.message});
	}
};
