"use strict";
import { config } from "dotenv";
config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import expressSession from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import fs from 'fs';
import https from 'https';
import csurf from "tiny-csrf";
import cookieParser from "cookie-parser";
import hsts from "hsts";
import expressEnforcesSSL from "express-enforces-ssl";
import helmet from "helmet";
import "./passport.js";

// TODO import routes
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import apiRoutes from "./routes/api.js";

function createServer() {
    const app = express();

    // usa cors <- permette di fare dal server richieste HTTP ad altri domini
    const corsOptions = {
	origin: [process.env.FRONTEND_URL, `https://localhost:${process.env.PORT || 5000}`],
	methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
	credentials: true, // permette di mandare sessions tramite cookies nelle HTTP requests
    };
    app.use(cors(corsOptions));
    // abilita pre flight cors
    app.options("*", cors(corsOptions));

    app.use(cookieParser("cookie-parser-secret"));

    // set up bodyParser and cors
    app.use(bodyParser.json({limit: "30mb", extended: true})); // permette il parsing di Content-Type: application/json
    // permette di ricevere form data
    app.use(bodyParser.urlencoded({limit: "30mb", extended: true})); // permette il parsing di Content-Type: application/x-www-form-urlenconded

    // forza https. Ogni richiesta http viene risposta con 301
    app.enable('trust proxy');
    app.use(expressEnforcesSSL());

    app.use(helmet({
      crossOriginResourcePolicy: false,
    }));

    // dice a richieste che arrivano in https di continuare a usare solo https
    app.use(hsts({
	maxAge: 31536000, // 1 anno in secondi. Il max
	includeSubDomains: true,
	preload: true, // i browsers hanno una HSTS preload list, una lista di websites ai quali il browser si connette con https anche se specifichi http
    })); // equivalente a mandare responses con Strict-Transport-Security: max-age: <maxAge>; includeSubDomains

    // TODO use routes
    // fa in modo che se l'utente ricarica la pagina egli e' comunque loggato. Utile per salvare qualsiasi tipo di stato nella sessione
    const cookieMaxAge = 24 * 60 * 60 * 100; // 1 giorno
    app.use(expressSession({ 
	name: "session",
	secret: process.env.SESSION_KEY, 
	cookie: {
	    maxAge: cookieMaxAge,
	    httpOnly: true,
	    secure: true,
	    sameSite: "strict",
	},
	resave: false, // non risalvare la sessione se l'id non cambia
	saveUninitialized: false, // non creare la sessione finche non viene memorizzato qualcosa nella sessione (user data)
	store: new MongoStore({
	    mongoUrl: process.env.DATABASE_URL,
	    collectionName: "sessions",
	    ttl: cookieMaxAge,
	    autoRemove: "native", // removes expired sessions
	    mongoOptions: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	    }
	}), // TODO se ti servono i suoi eventi salvatelo
	unset: "destroy", // session cancellata quando la risposta finisce
    }));

    // backend implementation di CSRF protection con un token nei form con post
    app.use(csurf(
	process.env.SESSION_KEY,
	["POST","PUT","PATCH","DELETE"], // metodi in cui ci vuole CSRF protection
	["/auth/login", "/auth/register"], // da escludere nel controllo
	[process.env.FRONTEND_URL + "/login", process.env.FRONTEND_URL + "/register"], // referers esclusi (urls da cui proviene richiesta). Essi non generano e non vedono il token
    ));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use("/user", userRoutes);
    app.use("/chat", chatRoutes);
    app.use("/auth", authRoutes);
    app.use("/api", apiRoutes);

    // error handler globale
    app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
	    success: false,
	    message: "something went wrong",
	});
    });

    // http://expressjs.com/en/advanced/best-practice-security.html#use-cookies-securely
    app.disable("x-powered-by");

    const key = fs.readFileSync('../CA/server/server.key');
    const cert = fs.readFileSync('../CA/server/server.pem');

    const server = https.createServer({ key, cert }, app);
    return server;
}

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DATABASE_URL)
    .then(connection => {
	const server = createServer(connection);
	server.listen({port: PORT, host: "127.0.0.1",}, console.log(`server running on port: ${PORT}`))
    }).catch(err => {
	console.error(err);
    });
