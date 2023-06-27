"use strict";
import express from "express";

import { getUsers, decryptEmail, sendFriend, decryptTextDataUser, createUser, uploadAvatarUser, sendUser } from "../controllers/user.js";

const router = express.Router();

router.get("/all", getUsers);

router.get("/email", decryptEmail, sendFriend);

export default router;
