import axios from "axios";
import { encode as uint8ToBase64 } from "uint8-to-base64";
//import { io } from "socket.io-client";

import { BACKEND_URL } from "../constants.js";
import { getNonce } from "./user.js";

// TODO encrypt email and message
export const postMessage = ({ from, to, msg, token }) => {
	return axios.post(`${BACKEND_URL}/chat/post`, { from: from, to: to, msg: msg, _csrf: token }, {
		withCredentials: true,
		responseType: "json",
		headers: {
			"Content-Type": "application/json",
		},
	});
};

export const getMessages = async (email1, email2) => {
	const encoder = new TextEncoder("utf8");
	const response = await getNonce();
	if (response.status !== 200) 
		throw new Error(`failed request with state ${response.status}`);

	const keyToImport = response.data.nonce;
	const key = await window.crypto.subtle.importKey("jwk", keyToImport, {name: "RSA-OAEP", hash: {name: "SHA-256"}}, false, ["encrypt"]);


	const data = encoder.encode(JSON.stringify({ email1: email1, email2: email2 }));
	let encryptedData = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, key, data);
	console.log("endryfsdafdhsaf");
	encryptedData = new Uint8Array(encryptedData);
	encryptedData = uint8ToBase64(encryptedData);

	//io(`${BACKEND_URL}/chat/all?v=${encryptedData}`);

	return axios.get(`${BACKEND_URL}/chat/all`, {
		withCredentials: true,
		responseType: "json",
		params: {
			v: encryptedData,
		},
	});
};

