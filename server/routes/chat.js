"use strict";
import express from "express";

import { createMessage, decryptData, getMessages } from "../controllers/chat.js";

const router = express.Router();

router.get("/all", 
	decryptData,
	getMessages,
);

router.post("/post", createMessage);

export default router;
