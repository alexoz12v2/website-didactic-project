import React from "react";

import Header from "../Header/Header";
import Contacts from "../Contacts/Contacts";

import "./Sidebar.css";

const Sidebar = () => {

	return (
		<div className="app__sidebar">
		<Header />
		<Contacts />
		</div>
	);
};

export default Sidebar;
