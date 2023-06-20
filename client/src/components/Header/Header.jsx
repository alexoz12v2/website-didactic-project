import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

import { useStore } from "../../AppContext";
import { BACKEND_URL } from "../../constants";

import "./Header.css";

const Header = () => {
	const { state } = useStore();
	const logout = () => {
		window.open(`${BACKEND_URL}/auth/logout`, "_self");
	};

	console.log(`Header.jsx: state.user${state}`);
	return (
		<div className="app__sidebar-header">
		{ state.user ? (
			<>
			<div className="app__sidebar-header-prifile-wrapper">
				<img src={state.user.avatar} alt="profileIcon" className="app__sidebar-header-profile-icon--size app__icon" />
				<p>{state.user.name.first + " " + state.user.name.last}</p>
			</div>
			<LogoutIcon sx={{marginLeft: "auto", marginRight: "5%", cursor: "pointer"}} onClick={logout}/>
			</>
		) : (
			<Link to="/login" className="app__sidebar-header-login">Login</Link>
		) }
		</div>
	);
};

export default Header;
