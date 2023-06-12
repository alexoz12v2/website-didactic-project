import { Sidebar, Chat, LoginForm } from "./components/";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import "./App.css";

// TODO create pages folder
// TODO Typography
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

	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<>
				<Sidebar user={user}/>
				<header className="app__main-window-header">
					header
				</header>
				<Outlet />
				</>
			),
			children: [
				{
					path: "/",
					element: (<Chat />),
				},
				{
					path: "/login",
					element: user ? (<Navigate to="/" />) : (<LoginForm />),
				}
			],
		},
	]);

	return (
		<div className="app__background--color app__background--size">
			<main className="app__main-window">
				<RouterProvider router={router}/>
			</main>
		</div>
	);
};

export default App;
