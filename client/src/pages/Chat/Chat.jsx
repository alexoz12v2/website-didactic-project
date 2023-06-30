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

let socket; 

const Chat = () => {
	const { state } = useStore(); 
	const [ messageList, setMessageList ] = useState([]);
	const [con, setCon] = useState(false);
	const textRef = useRef(null);
	const [oldFriend, setOldFriend] = useState(null);

	const submitMessage = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		const msg = textRef.current.value;

		if (msg.length === 0)
			return;
		
		try {
			if (!state.selectedFriendEmail)
				throw new Error("friend email is null");

			const chatId = [state.user.email, state.selectedFriendEmail].sort().join();
			const email = state.user.email;
			const sender = state.selectedFriendEmail;

			console.log(`chat:${chatId}:send`, msg);
			socket.emit(`chat:${chatId}:send`, msg);

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
		if (!state.selectedFriendEmail || !state.user.email)
			return;

		const chatId = [state.user.email, state.selectedFriendEmail].sort();
		const email = state.user.email;
		const sender = state.selectedFriendEmail;

		console.log("connecting");
		socket = io(`${BACKEND_URL}`, {
			withCredentials: true,
			query: {
				v: chatId,
				e: email,
				s: sender,
			},
			reconnectionAttempts: "Infinity",
			timeout: 10000,
			transports: ["websocket"],
		});

		socket.on(`chat:${chatId}:receive`, msgs => {
			console.log(`messages arrived: `);
			console.log(msgs);
			if (oldFriend && oldFriend !== state.selectedFriendEmail)
				setMessageList(() => [ ...msgs ]);
			else
				setMessageList(old => [ ...old, ...msgs ]);
		});

		setCon(() => true);
		setOldFriend(() => state.selectedFriendEmail);
	}, [state.selectedFriendEmail]);

	return (
		<div className="app__chatbox">
			<main className="chat__messageContainer">
				{ messageList?.length !== 0 && 
					messageList.map((msg, id) => (<Message placement={msg.sender === state.user.email ? "flex-end" : "flex-start"} content={msg.content} key={id}/>))
				}
			</main>
			<form>
				<input type="hidden" name="_csrf" value={state.token} />
				<textarea onKeyPress={con ? e => {if(e.key === "Enter") return submitMessage(e);} : e => {e.preventDefault();e.stopPropagation();}}
					style={{backgroundColor: "#202020",color:"#fdca00"}} ref={textRef} name="message" placeholder="type your message" 
				/>
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
