import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";

import Header from "../Header/Header";
import Contact from "../Contact/Contact";
import { useStore } from "../../AppContext";
import "./Sidebar.css";

const Sidebar = ({ user }) => {
	const navigate = useNavigate();
	const { state } = useStore();

	const goHome = e => {
		navigate("/");
	};

	return (
		<div className="app__sidebar">
			<Header user={user}/>
			<div onClick={goHome} style={{display: "flex", alignItems: "center", color: "white"}}>
				<HomeIcon />
				Torna alla Home
			</div>
			<Contact user={{
				avatar: "https://wallpapers.com/images/featured/87h46gcobjl5e4xu.jpg",
				name: {
					first: "bob",
					last: "rossi",
				},
			}} />
			{ (state.user && state.user.friends && state?.user?.friends?.length !== 0) ? (
				state.user.friends.map((friend, idx) => (
					<Contact key={idx} user={{
						avatar: friend.avatarURL,
						name: friend.name,
					}} />
				))
			) : null}		
		</div>
	);
};

export default Sidebar;
