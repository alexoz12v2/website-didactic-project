import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { useEffect, useReducer } from "react";

import { Sidebar } from "./components/";
import { Chat, Profile, Authentication, Home } from "./pages/";
import { getUser } from "./api/";
import { Store } from "./AppContext";

import "./App.css";
const reducer = (state, action) => {
	switch (action.type) {
		case "login":
			return {
				user: action.payload.user || state.user,
				token: action.payload.token || state.token,
			};
		case "token":
			return {
				...state,
				token: action.payload.token || state.token,
			};
		default: 
			return state;
	}
};

const App = () => {
	// TODO refactor in reducer + context 
	const [state, dispatch] = useReducer(reducer, {
		user: null,/*{
				name: {
					first: null,
					last: null,
				},
				email: null,
				avatar: null,
				friends: [],
		},*/
		token: null,
	});

	useEffect(() => {
		getUser().then(response => {
			if (response.status !== 200) 
				throw new Error("authentication failed!");

			dispatch({type: "login", payload: {
				user: response.data.user,
				token: response.data.token,
			}});
		}).catch((err) => {
			console.log(err);
		});
	}, []);

	const chatElement = () => {
		if (state.user) {
			console.log(`render! ${!!state.user}`)
			return (<Chat />) 
		}
		else {
			return (<Navigate to="/" />);
		}
	}

	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<Store.Provider value={{state, dispatch}}>
				<Sidebar />
				<header className="app__main-window-header">
					header
				</header>
				<Outlet />
				</Store.Provider>
			),
			children: [
				{
					path: "/",
					element: (<Home />),
				},
				{
					path: "/chat",
					element: chatElement(),
				},
				{
					path: "/profile",
					element: state.user ? (<Profile />) : (<Navigate to="/" />),
				},
				{
					path: "/login",
					element: state.user ? (<Navigate to="/" />) : (<Authentication />),
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
