"use strict";
import express from "express";

import { 
	getUsers, 
	decryptEmail, 
	sendFriend, 
	decryptTextDataUser, 
	createUser, 
	uploadAvatarUser, 
	sendUser, 
	addFriend, 
	sendFriends,
	removeFriend,
} from "../controllers/user.js";

const router = express.Router();

router.get("/all", getUsers);

router.get("/email", decryptEmail, sendFriend);

router.put("/newfriend", decryptTextDataUser, addFriend);

router.get("/friends", decryptEmail, sendFriends);

router.patch("/removefriend", decryptTextDataUser, removeFriend);

export default router;
