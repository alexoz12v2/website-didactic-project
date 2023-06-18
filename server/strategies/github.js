"use strict";
import { config } from "dotenv";
config();
import { Strategy as GitHubStrategy } from "passport-github2";
import passport from "passport";

import { oauthGitHubStrategyCallbackUser as cb } from "../controllers/user.js";

passport.use(new GitHubStrategy({
		clientID: process.env.GITHUB_CLIENT_ID,
		clientSecret: process.env.GITHUB_CLIENT_SECRET,
		callbackURL: "/auth/github/callback",
		scope: ["user:email","profile"],
}, cb));
