import React from "react";

import { Sidebar, Chat } from "./components/";
import  useState from "react";
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
	     <div>
      {isLogged ? (
        <div>
          <h2>Benvenuto! Sei loggato.</h2>
          <button onClick={handleLogout}>Logout</button>
          {/* Mostra i componenti sideBar e chat */}
          <Sidebar />
          <Chat />
        </div>
      ) : (
        <div>
          <h2>Effettua il login</h2>
          <button onClick={handleLogin}>Login</button>
          {/* Mostra il componente LoginForm */}
          <LoginForm />
        </div>
      )}
    </div>
		
		</div>
	);
};

export default App;
