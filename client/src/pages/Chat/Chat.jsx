import React from "react";

import "./Chat.css"

const Chat = () => {

	return (
		<div className="app__chatbox">
			<main style={{backgroundColor: "violet", height: "90%"}}>
			</main>
			<form style={{backgroundColor: "blue", flex: 1,}}>
				<input type="text" name="message" placeholder="type your message" />
				<input type="submit" name="send" value="cliccami" />
			</form>
		</div>
	);
};

export default Chat;
