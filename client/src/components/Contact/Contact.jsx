import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';

import { useStore } from "../../AppContext";

import "./Contact.css";

// TODO work with store
const Contact = ({user, preOnClickHook, style, removeFriend}) => {
	const navigate = useNavigate();
	const { dispatch } = useStore();
	const callback= e => {
		if (preOnClickHook) { 
			console.log("gggggggggggggggggggggggggggggggggggggggggggg");
			preOnClickHook();
		}

		dispatch({ type: "selectFriend", payload: { friendEmail: user.email, }, });
		navigate("/chat");
	};

	return (
		<div className="contact" onClick={callback} style={style}>
			<img className="contact__image" src={user.avatar} alt="profileIcon" />
			<span className="contact__name" >
				{user.name.first + " " + user.name.last}
			</span>
			<CloseIcon onClick={removeFriend(user)}/>	
		</div>
	);
};

export default Contact;
