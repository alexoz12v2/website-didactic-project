"use strict";
import express from "express";
import mongoose from "mongoose";

import UserModel from "../models/user.js";

export const getUsers = async (req, res) => {
	try {
		const users = await UserModel.find();

		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({message: error.message});
	}
};
