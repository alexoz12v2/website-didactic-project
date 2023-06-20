import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";

import Header from "../Header/Header";
import Contact from "../Contact/Contact";
import "./Sidebar.css";

const Sidebar = ({ user }) => {
	const navigate = useNavigate();
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
		</div>
	);
};

export default Sidebar;
