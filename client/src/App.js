import { Sidebar, Chat, LoginForm } from "./components/";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "./App.css";

// TODO create pages folder
const App = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const getUser = () => {
			fetch("http://localhost:5000/auth/login/success", {
				method: "GET",
				credentials: "include",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"Access-Control-Allow-Credentials": true,
				},
			}).then((response) => {
				if (response.status === 200) return response.json();
				throw new Error("authentication has been failed!");
			}).then((resObject) => {
				setUser(resObject.user);
			}).catch((err) => {
				console.log(err);
			});
		};

		getUser();
	}, []);

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
