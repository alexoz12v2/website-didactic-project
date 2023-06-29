import { Server } from "socket.io"; 

export default function(httpServer) {
    const io = new Server(httpServer);

    io.on("connection", socket => {
	console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
	console.log(socket);
    });

    return io;
}
