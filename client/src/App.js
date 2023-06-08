import React from "react";

import { Sidebar, Chat } from "./components/";

import "./App.css";

const App = () => {

	return (
		<div className="app__background--color app__background--size">
		<Sidebar />
		<Chat />
		</div>
	);
};

export default App;
