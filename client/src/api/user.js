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

export function postCredentials(formData) {
	return axios.post(`${BACKEND_URL}/auth/login`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
		responseType: "json",
		withCredentials: true,
	});
};

export function getToken() {
	return axios.get(`${BACKEND_URL}/api/token`, {
		withCredentials: true,
		responseType: "json",
	});
};

export function getUserInfoByEmail(encryptedEmail) {
	return axios.get(`${BACKEND_URL}/user/email`, {
		responseType: "json",
		params: {
			v: encryptedEmail,
		},
	});
};
