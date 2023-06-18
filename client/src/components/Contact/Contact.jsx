import React from "react";

const Contact = ({ user }) => {

	return (
		<div>
			<img src={user.avatar} alt="profileIcon" />
			<span>{user.name.first + " " + user.name.last}</span>
		</div>
	);
};

export default Contact;
