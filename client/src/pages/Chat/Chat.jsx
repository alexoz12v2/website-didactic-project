import { useRef, useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { io } from "socket.io-client";
import { encode as uint8ToBase64 } from "uint8-to-base64";

import { Message } from "../../components/";
import { postMessage, getMessages, getToken } from "../../api/";
import { useStore } from "../../AppContext";
import { BACKEND_URL } from "../../constants";
import { getNonce } from "../../api/";

import "./Chat.css"

const chatIdentifier = async (email1, email2) => {
	try {
		const encoder = new TextEncoder("utf8");
		const response = await getNonce();
		if (response.status !== 200) 
			throw new Error(`failed request with state ${response.status}`);

		const keyToImport = response.data.nonce;
		const key = await window.crypto.subtle.importKey("jwk", keyToImport, {name: "RSA-OAEP", hash: {name: "SHA-256"}}, false, ["encrypt"]);

		const identifier = [ email1, email2 ];
		identifier.sort();

		let data = encoder.encode(JSON.stringify(identifier));
		let encryptedData = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, key, data);

		encryptedData = new Uint8Array(encryptedData);
		encryptedData = uint8ToBase64(encryptedData);
		const encryptedChat = encryptedData;

		data = encoder.encode(JSON.stringify(email1));
		encryptedData = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, key, data);
		encryptedData = new Uint8Array(encryptedData);
		encryptedData = uint8ToBase64(encryptedData);
		const encryptedEmail = encryptedData;

		data = encoder.encode(JSON.stringify(email2));
		encryptedData = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, key, data);
		encryptedData = new Uint8Array(encryptedData);
		encryptedData = uint8ToBase64(encryptedData);
		const encryptedSender = encryptedData;

		return [encryptedChat, encryptedEmail, encryptedSender];
	} catch (err) {
		console.error(err);
		return err;
	}
}

let socket; 

const Chat = () => {
	const { state, dispatch } = useStore(); 
	const [ messageList, setMessageList ] = useState([]);
	const [con, setCon] = useState(false);
	const textRef = useRef(null);
	const [c, setC] = useState(null);

	const submitMessage = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		const msg = textRef.current.value;

		if (msg.length === 0)
			return;
		
		try {
			if (!state.selectedFriendEmail)
				throw new Error("friend email is null");

			const { chatId, userId, friendId } = c;
			console.log(`chat:${chatId}:${friendId}:send`, msg);
			socket.emit(`chat:${chatId}:${userId}:send`, msg); // TODO remove

			//const res = await postMessage({
			//	from: state.user.email, 
			//	to: state.selectedFriendEmail, 
			//	msg: msg, 
			//	token: state.token
			//});
			//setMessageList(old => [ ...old, res.data]);
			//const { data } = await getToken();
			//dispatch({type: "token", payload: {
			//	token: data.token,
			//}});
		} catch (err) {
			console.error(err);
		}
		
		textRef.current.value = "";
	};
	
	useEffect(() => {
		textRef.current.focus();
		if (!state.selectedFriendEmail)
			return;

		chatIdentifier(state.user.email, state.selectedFriendEmail)
			.then(([encryptedChat, encryptedEmail, encryptedSender]) => {
				console.log("connecting");
				socket = io(`${BACKEND_URL}`, {
					withCredentials: true,
					query: {
						v: encryptedChat,
						e: encryptedEmail,
						s: encryptedSender,
					},
					reconnectionAttempts: "Infinity",
					timeout: 10000,
					transports: ["websocket"],
				});

				socket.on(`chat:${encryptedChat}:${encryptedSender}:receive`, msg => {
					console.log(`The message is: ${msg}`);
				})

				setC(() => {
					return {
						chatId: encryptedChat,
						userId: encryptedEmail,
						friendId: encryptedSender,
					};
				})
				setCon(() => true);
			})
	}, []);

	return (
		<div className="app__chatbox">
			<main className="chat__messageContainer">
				{ messageList?.length !== 0 && 
					messageList.map((msg, id) => (<Message placement={msg.sender === state.user.email ? "flex-end" : "flex-start"} content={msg.content} key={id}/>))
				}
			</main>
			<form>
				<input type="hidden" name="_csrf" value={state.token} />
				<textarea style={{backgroundColor: "#202020"}} ref={textRef} name="message" placeholder="type your message" />
				<SendIcon sx={{
					marginLeft: "20px",
					transform: "scale(2)",
					cursor: "pointer",
				}} onClick={con ? submitMessage : e => {e.preventDefault();e.stopPropagation();}} />
			</form>
		</div>
	);
};

export default Chat;
