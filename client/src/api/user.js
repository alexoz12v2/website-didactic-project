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
		validateStatus: status => ((status >= 200 && status < 300) || status === 404),
		withCredentials: true,
	});
};

export function postNewUserData(formData) {
	return axios.post(`${BACKEND_URL}/auth/register`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
		responseType: "json",
		withCredentials: true,
	});
};

export function addFriend(encryptedObj, token) {
	return axios.put(`${BACKEND_URL}/user/newfriend`, {encryptedText: encryptedObj, _csrf: token}, {
		headers: {
			"Content-Type": "application/json",
		},
		responseType: "json",
		withCredentials: true,
	});
};

export function getFriends(encryptedEmail) {
	return axios.get(`${BACKEND_URL}/user/friends`, {
		params: {
			v: encryptedEmail,
		},
		responseType: "json",
		withCredentials: true,
	});
};

export function removeFriend(encryptedData) {
	return axios.patch(`${BACKEND_URL}/user/removefriend`, encryptedData, {
		headers: {
			"Content-Type": "application/json",
		},
		responseType: "json",
		withCredentials: true,
	});
}
