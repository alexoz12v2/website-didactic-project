import { useNavigate } from "react-router-dom";

// import { useStore } from "../../AppContext";

import "./Contact.css";

// TODO work with store
const Contact = ({user}) => {
	const navigate = useNavigate();
	//const { state } = useStore();
	const callback= e => {
		navigate("/chat");
	};

	return (
		<div className="contact" onClick={callback}>
			<img className="contact__image" src={user.avatar} alt="profileIcon" />
			<span className="contact__name" >
				{user.name.first + " " + user.name.last}
			</span>
		</div>
	);
};

export default Contact;
