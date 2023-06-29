import { Server } from "socket.io"; 
import { privateDecrypt, privateEncrypt, constants as cryptoConstants } from "crypto";
import { config } from "dotenv";
import utf8 from "utf8";
import { privateKey } from "./keypair.js";
config();

export default function(httpServer, corsOptions) {
    const io = new Server(httpServer, {
	cors: corsOptions,
    });

    io.on("connection", socket => {
	console.log("3333333333333333333333333333333333333333333333333333");
	console.log(`chat:${socket.handshake.query.v}:${socket.handshake.query.e}:send`);

	socket.on(`chat:${socket.handshake.query.v}:${socket.handshake.query.e}:send`, msg => {
	    console.log(msg);
	    socket.emit(`chat:${socket.handshake.query.v}:${socket.handshake.query.s}:receive`, msg);
	    socket.emit(`chat:${socket.handshake.query.v}:${socket.handshake.query.e}:receive`, msg);
	});
    });

    io.on("error", err => {
	console.log("44444444444444444444444444444444444444444444444444444");
	console.log(err);
    })

    return io;
}
