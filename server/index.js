"use strict";
import { config } from "dotenv";
config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"

// TODO import routes
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";

const app = express();

// set up bodyParser and cors
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

// TODO use routes
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

const CONNECTION_URL = "mongodb+srv://alessio:alessio@firstdb.mxhkwcy.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL)
		.then(() => app.listen({port: PORT, host: "127.0.0.1",}, console.log(`server running on port: ${PORT}`)))
		.catch(error => console.error(error));
