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
	const email1 = socket.handshake.query.e;
	const email2 = socket.handshake.query.s;
	const chatId = socket.handshake.query.v;

	socket.join(`chat:${chatId}`);

	socket.on(`chat:${chatId}:send`, async (msgContent) => {
	    await createMessageRT(email1, email2, msgContent);

	    io.to(`chat:${chatId}`).emit(`chat:${chatId}:receive`, [{sender: email1, content: msgContent}]);
	});

	// invia la chat esistente tra socket.handshake.query.e e socket.handshake.query.s
	const msgData = await getMessagesData(email1, email2);
	if (msgData.length !== 0) {
	    console.log(msgData);
	    socket.emit(`chat:${chatId}:receive`, msgData);
	}
    });

    io.on("error", err => {
	console.log("44444444444444444444444444444444444444444444444444444");
	console.log(err);
    })

    return io;
}
