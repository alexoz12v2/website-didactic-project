import React from "react";

// TODO remove
import profileIcon from "../../assets/profile_icon_placeholder.jpg";

import "./Header.css";

const Header = ({ user }) => {

	return (
		<div className="app__sidebar-header">
		{ user ? (
			<div className="app__sidebar-header-prifile-wrapper">
				<img src={profileIcon} alt="profileIcon" className="app__sidebar-header-profile-icon--size app__icon" />
				{user?.displayName}
			</div>
		) : (
			<div className="app__sidebar-header-login">Login</div>
		) }
		</div>
	);
};

export default Header;
