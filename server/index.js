"use strict";
import { config } from "dotenv";
config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import cookieSession from "cookie-session";
import passport from "passport";
import "./passport.js";

// TODO import routes
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();

// set up bodyParser and cors
app.use(bodyParser.json({limit: "30mb", extended: true}));
// permette di ricevere form data
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
// usa cors <- permette di fare dal server richieste HTTP ad altri domini
app.use(cors({
	origin: process.env.FRONTEND_URL,
	methods: "GET,POST,PUT,PATCH,DELETE",
	credentials: true, // permette di mandare sessions nelle HTTP requests
}));

// TODO use routes
// fa in modo che se l'utente ricarica la pagina egli e' comunque loggato. Utile per salvare qualsiasi tipo di stato nella sessione
app.use(cookieSession({ 
	name:"session", 
	keys:[process.env.SESSION_KEY], 
	maxAge: 24 * 60 * 60 * 100, /*1 giorno*/
}));
// register regenerate & save after the cookieSession middleware initialization
app.use((request, response, next) => {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb();
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb();
        }
    }
    next();
});


app.use(passport.initialize());
app.use(passport.session());
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/auth", authRoutes);

const CONNECTION_URL = "mongodb+srv://alessio:alessio@firstdb.mxhkwcy.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL)
		.then(() => app.listen({port: PORT, host: "127.0.0.1",}, console.log(`server running on port: ${PORT}`)))
		.catch(error => console.error(error));
