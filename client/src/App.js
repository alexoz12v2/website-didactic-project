import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import { Sidebar } from "./components/";
import { Chat, Profile, Authentication, Home } from "./pages/";
import { getUser } from "./api/";

import "./App.css";

// TODO create pages folder
// TODO Typography
// TODO se passi funzioni a nested components, usa useCallback
// TODO useRef: stato che non e' renderizzato, quindi il compoenente non deve essere rerenderizzato
// TODO useMemo per computazione pesante. Eg. filtrare lista di messaggi basata su visibility
const App = () => {
	// TODO refactor in reducer + context 
	const [user, setUser] = useState(null);

	useEffect(() => {
		getUser().then(response => {
			if (response.status !== 200) 
				throw new Error("authentication failed!");

			console.log("authentication:");
			console.log(response);
			setUser(() => response.data.user);
		}).catch((err) => {
			console.log(err);
		});
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
					element: (<Home />),
				},
				{
					path: "/chat",
					element: user ? (<Navigate to="/" />) : (<Chat />),
				},
				{
					path: "/profile",
					element: user ? (<Navigate to="/" />) : (<Profile />),
				},
				{
					path: "/login",
					element: user ? (<Navigate to="/" />) : (<Authentication setUser={setUser}/>),
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
