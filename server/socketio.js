import { Server } from "socket.io"; 
import { privateDecrypt, privateEncrypt, constants as cryptoConstants } from "crypto";
import { config } from "dotenv";
import utf8 from "utf8";

import { privateKey } from "./keypair.js";
import { getMessagesData, createMessageRT  } from "./controllers/chat.js";
config();

export default function(httpServer, corsOptions) {
    const io = new Server(httpServer, {
	cors: corsOptions,
    });

    io.on("connection", async (socket) => {
	const key = { 
		key: privateKey, 
		padding: cryptoConstants.RSA_PKCS1_OAEP_PADDING,
		oaepHash: 'sha256', 
	};
	let decryptedData = privateDecrypt(key, Buffer.from(socket.handshake.query.e, "base64"));
	const email1 = JSON.parse(decryptedData.toString("utf-8"));
	decryptedData = privateDecrypt(key, Buffer.from(socket.handshake.query.s, "base64"));
	const email2 = JSON.parse(decryptedData.toString("utf-8"));
	
	console.log("3333333333333333333333333333333333333333333333333333");
	console.log(`chat:${socket.handshake.query.v}:${socket.handshake.query.e}:send`);

	socket.on(`chat:${socket.handshake.query.v}:${socket.handshake.query.e}:send`, async (msgContent) => {
	    console.log(msgContent);

	    await createMessageRT(email1, email2, msgContent);

	    socket.emit(`chat:${socket.handshake.query.v}:${socket.handshake.query.s}:receive`, [{sender: email1, content: msgContent}]);
	    socket.emit(`chat:${socket.handshake.query.v}:${socket.handshake.query.e}:receive`, [{sender: email1, content: msgContent}]);
	});

	// invia la chat esistente tra socket.handshake.query.e e socket.handshake.query.s
	const msgData = await getMessagesData(email1, email2);
	if (msgData.length !== 0) {
	    console.log(msgData);
	    socket.emit(`chat:${socket.handshake.query.v}:${socket.handshake.query.s}:receive`, msgData);
	}
    });

    io.on("error", err => {
	console.log("44444444444444444444444444444444444444444444444444444");
	console.log(err);
    })

    return io;
}
