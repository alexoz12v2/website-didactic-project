import { useRef, useEffect, useState } from "react";
import { Message } from "../../components/";
import { postMessage, getMessages, getToken } from "../../api/";
import { useStore } from "../../AppContext";

import "./Chat.css"

const Chat = () => {
	const { state, dispatch } = useStore(); 
	const [ messageList, setMessageList ] = useState([]);
	const textRef = useRef(null);

	//TODO remove quando lista amici
	const email = "alexoz12cgdev@gmail.com";
	const recipient = "oboken1974@hotmail.it";
	const submitMessage = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		const msg = textRef.current.value;
		
		try {
			const res = await postMessage({
				from: email, 
				to: recipient, 
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
		textRef.current.focus();
			getMessages(email, recipient)
				.then(response => {
					console.log("ding dong! Chat arrived!");
					console.log(response.data);
					setMessageList(() => response.data);
				})
				.catch(err => {
					console.error("No messages" + err.message);
				});
	}, []);

	return (
		<div className="app__chatbox">
			<main style={{backgroundColor: "violet", height: "90%"}}>
				<Message content="sdfafdhsafjdsafldaj" />
				{ messageList?.length !== 0 && 
					messageList.map((msg, id) => (<Message content={msg} key={id}/>))
				}
			</main>
			<form style={{backgroundColor: "blue", flex: 1,}}>
				<input type="hidden" name="_csrf" value={state.token} />
				<textarea ref={textRef} name="message" placeholder="type your message" />
				<input onClick={submitMessage} type="submit" name="send" value="cliccami" />
			</form>
		</div>
	);
};

export default Chat;
