import React from "react";

import "./Contact.css"

const Contact = ({ user }) => {
	const callback= e => {
		window.open("/chat", "_self"); //TODO solo se sei loggato
	};

	return (
		<div className="contact" onClick={callback}>
			<img className="contact__image" src={user.avatar} alt="profileIcon" />
			<span className="contact__name" >{user.name.first + " " + user.name.last}</span>
		</div>
	);
};

export default Contact;
