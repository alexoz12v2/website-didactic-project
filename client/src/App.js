import { Sidebar, Chat, LoginForm } from "./components/";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

// TODO create pages folder
const App = () => {
	const user = true;

	return (
		<div className="app__background--color app__background--size">
			<Sidebar user={user}/>
			<main className="app__main-window">
				<header className="app__main-window-header">
					header
				</header>
				<Routes>
					<Route path="/" element={<Chat />} />
					<Route path="/login" element={user ? <Navigate to="/" /> : <LoginForm />} />
				</Routes>
			</main>
		</div>
	);
};

export default App;
