import axios from "axios";

import { BACKEND_URL } from "../constants.js";

export function getUser() {
	return axios.get(`${BACKEND_URL}/auth/login/success`, {
		withCredentials: true, // includi i cookies (sessionID) in richieste cross-site
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});
}

export function getNonce() {
	return axios.get(`${BACKEND_URL}/auth/register/nonce`, {
		withCredentials: true,
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});
};

export function postCredentials(encryptedCredentials) {
	return axios.post(`${BACKEND_URL}/auth/login`, {b64data: encryptedCredentials}, {
		headers: {
			"Content-Type": "application/json",
		},
		responseType: "json",
		withCredentials: true,
	});
};
