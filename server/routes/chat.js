"use strict";
import express from "express";

import { getChats } from "../controllers/chat.js";

const router = express.Router();

router.get("/all", getChats);

export default router;
