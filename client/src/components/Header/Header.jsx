import React from "react";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

import "./Header.css";

// TODO non usare l'informazione di google account direttamente, usa la roba di oauth per creare un 
const Header = ({ user }) => {
	const BACKEND_URL = "https://localhost:5000";
	const logout = () => {
		window.open(`${BACKEND_URL}/auth/logout`, "_self");
	};

	console.log(user);
	return (
		<div className="app__sidebar-header">
		{ user ? (
			<>
			<div className="app__sidebar-header-prifile-wrapper">
				<img src={user.avatar} alt="profileIcon" className="app__sidebar-header-profile-icon--size app__icon" />
				<p>{user.name.first + " " + user.name.last}</p>
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
