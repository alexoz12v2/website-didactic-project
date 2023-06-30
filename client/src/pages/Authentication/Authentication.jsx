import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { postCredentials, getUser } from "../../api/";
import { NonceForm } from "../../components/";

import { BACKEND_URL } from "../../constants.js";
import { useStore } from "../../AppContext";

import Google from "../../assets/google.png";
import GitHub from "../../assets/github.png";
import "./Authentication.css";

const Authentication = () => {
	const { state, dispatch } = useStore();
	const redirect = (toUrl) => { // fai la richiesta di autenticazione tramite google alla route del backend che ha come middleware 
		// passport.authenticate("google", { scope: ["profile"] });
		// ma non la puoi fare direttamente dal frontend
		// user { displayName, name { familyName, givenName } id, photos [{value},...] }
		return () => window.open(`${BACKEND_URL}/${toUrl}`, "_self");
	};

	const navigate = useNavigate();

	const postCallback = useCallback(async (formData) => {
		try {
			await postCredentials(formData);
			const response = await getUser();

			dispatch({type: "login", payload: {
				user: response.data.user,
				token: response.data.token,
			}});
			console.log(state)

			navigate("/");
		} catch (err) {
			console.error(err);
		}
	}, [state, dispatch, navigate]);
	console.log("rendering component");

	return (
		<>
			<h1 className="app__login-title">Scegli un metodo di Autenticazione</h1>
			<div className="app__login-left-box">
				<div className="app__login-button google" onClick={redirect("auth/google")}>
					<img src={Google} alt="" className="icon" />
					Google
				</div>
				<div className="app__login-button github" onClick={redirect("auth/github")}>
					<img src={GitHub} alt="" className="icon" />
					Github
				</div>
			</div>
			<div className="app__login-center-box">
				<div className="line" />
				<div className="or">OR</div>
			</div>
			<NonceForm postCallback={postCallback} className="app__login-right-box">
				<input type="text" name="email" placeholder="Email" />
				<input type="password" name="password" placeholder="Password" />
				<input type="submit" name="login" className="submit" value="Login" style={{cursor: "pointer"}}/>
			</NonceForm>
			{/*UM8v0SX6pm*/}
			<div style={{
				gridColumnStart:1,
				gridColumnEnd:3,
			}}>
				Non sei ancora registrato? <span onClick={e => { navigate("/a/register"); }}className="app__register_button--color">Registrati</span>
			</div>
		</>
	);
};

export default Authentication;
