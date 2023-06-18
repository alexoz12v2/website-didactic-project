"use strict";
import { config } from "dotenv";
config();
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import mongoose from "mongoose";

import { oauthGoogleStrategyCallbackUser as cb } from "../controllers/user.js";

passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: "/auth/google/callback", // URL della middleware della funzione cb
}, cb));
