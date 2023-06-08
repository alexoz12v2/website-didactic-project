import React from "react";

import Profile from "../Profile/Profile";
import OptionList from "../OptionList/OptionList";

import "./Header.css";

const Header = () => {

	return (
		<div className="app__sidebar-header">
		<Profile />
		<OptionList />
		</div>
	);
};

export default Header;
