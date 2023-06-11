import React from "react";
import { Link } from "react-router-dom";

// TODO remove
import profileIcon from "../../assets/profile_icon_placeholder.jpg";

import "./Header.css";

const Header = ({ user }) => {

	return (
		<div className="app__sidebar-header">
		{ user ? (
			<div className="app__sidebar-header-prifile-wrapper">
				<img src={profileIcon} alt="profileIcon" className="app__sidebar-header-profile-icon--size app__icon" />
				<p>{user?.displayName}</p>
			</div>
		) : (
			<Link to="/login" className="app__sidebar-header-login">Login</Link>
		) }
		</div>
	);
};

export default Header;
