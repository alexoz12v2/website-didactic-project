import React from "react";

import { Sidebar, Chat } from "./components/";
import { useState } from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import "./App.css";


const App = () => {
	const [isLogged, setIsLogged] = useState(false);

	const handleLogin = () => {
	  // Effettua il login e imposta isLogged a true se l'accesso ha successo
	  setIsLogged(true);
	};
  
	const handleLogout = () => {
	  // Effettua il logout e imposta isLogged a false
	  setIsLogged(false);
	};
	return (
		<div className="app__background--color app__background--size">
			{isLogged ? (
				<>
					<Sidebar />
					<Chat />
				</>
			) : (
				<>
					<LoginForm />
				</>
			)}
		</div>
	);
};

export default App;
