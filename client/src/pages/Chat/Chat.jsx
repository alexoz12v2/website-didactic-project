import { useRef, useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';

import { Message } from "../../components/";
import { postMessage, getMessages, getToken } from "../../api/";
import { useStore } from "../../AppContext";

import "./Chat.css"

const Chat = () => {
	const { state, dispatch } = useStore(); 
	const [ messageList, setMessageList ] = useState([]);
	const textRef = useRef(null);

	const submitMessage = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		const msg = textRef.current.value;

		if (msg.length === 0)
			return;
		
		try {
			if (!state.selectedFriendEmail)
				throw new Error("friend email is null");

			const res = await postMessage({
				from: state.user.email, 
				to: state.selectedFriendEmail, 
				msg: msg, 
				token: state.token
			});
			setMessageList(old => [ ...old, res.data]);
			const { data } = await getToken();
			dispatch({type: "token", payload: {
				token: data.token,
			}});
		} catch (err) {
			console.error(err);
		}
		
		textRef.current.value = "";
	};
	
	useEffect(() => {
		if (!state.selectedFriendEmail)
			return;

		textRef.current.focus();
			getMessages(state.user.email, state.selectedFriendEmail)
				.then(response => {
					console.log("ding dong! Chat arrived!");
					console.log(response.data);
					setMessageList(() => response.data);
				})
				.catch(err => {
					console.error("No messages" + err.message);
				});
	}, [state.user.email, state.selectedFriendEmail]);

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
				}} onClick={submitMessage} />
			</form>
		</div>
	);
};

export default Chat;
