import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { useEffect, useReducer } from "react";

import { Sidebar } from "./components/";
import { Chat, Profile, Authentication, Home, Register } from "./pages/";
import { getUser } from "./api/";
import { Store } from "./AppContext";

import "./App.css";
const reducer = (state, action) => {
	switch (action.type) {
		case "login":
			return {
				user: action.payload.user || state.user,
				token: action.payload.token || state.token,
				selectedFriendEmail: null,
			};
		case "token":
			return {
				...state,
				token: action.payload.token || state.token,
			};
		case "displayFriend":
			return {
				...state,
				user: {
					...state.user,
					friends: action.payload.friends || state.user.friends,
				},
				selectedFriendEmail: null,
			};
		case "selectFriend":
			return {
				...state,
				selectedFriendEmail: action.payload.friendEmail || state.selectedFriendEmail,
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
		selectedFriendEmail: null, /*string*/
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

	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<Store.Provider value={{state, dispatch}}>
				<Sidebar />
				<header className="app__main-window-header">
					BuddyBuzz
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
					element: state?.user ? (<Chat />) : (<Navigate to="/" />),
				},
				{
					path: "/profile",
					element: state?.user ? (<Profile />) : (<Navigate to="/" />),
				},
				{
					path: "/a",
					element: (
						<div className="app__chatbox">
							<div className="app__auth-wrapper">
								<Outlet />
							</div>
						</div>
					),
					children: [
						{
							path: "/a/login",
							element: state.user ? (<Navigate to="/" />) : (<Authentication />),
						},
						{
							path: "/a/register",
							element: state.user ? (<Navigate to="/" />) : (<Register />),
						}
					]
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

