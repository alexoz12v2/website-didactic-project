import { useCallback } from "react";

import { postCredentials } from "../../api/";
import { NonceForm } from "../../components/";

import { BACKEND_URL } from "../../constants.js";

import Google from "../../assets/google.png";
import GitHub from "../../assets/github.png";
import "./Authentication.css";

// TODO refactor codice ripetuto
// TODO password criptata
// TODO cambia il post action nel form
// TODO refactor prop
const Authentication = ({setUser}) => {
	// TODO refactor to one function
	const redirect = (toUrl) => { // fai la richiesta di autenticazione tramite google alla route del backend che ha come middleware 
		// passport.authenticate("google", { scope: ["profile"] });
		// ma non la puoi fare direttamente dal frontend
		// user { displayName, name { familyName, givenName } id, photos [{value},...] }
		return () => window.open(`${BACKEND_URL}/${toUrl}`, "_self");
	};

	const postCallback = useCallback(async (encryptedData) => {
		try {
			const response = await postCredentials(encryptedData);
			console.log(response);
			setUser(() => response.data.user);
			window.open("/", "_self");
		} catch (err) {
			console.error(err);
		}
	}, [setUser]);
	console.log("rendering component");

	return (
		<div className="app__chatbox">
			<div className="app__login-wrapper">
				<h1 className="app__login-title">Choose a Login Method</h1>
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
				{/* rifare con il nonce */}
				<NonceForm postCallback={postCallback} className="app__login-right-box">
			  		<input type="text" name="email" placeholder="Email" />
			  		<input type="password" name="password" placeholder="Password" />
					<input type="submit" name="login" className="submit" value="Login" style={{cursor: "pointer"}}/>
				</NonceForm>
				UM8v0SX6pm
		  	</div>
		</div>
	);
};

export default Authentication;
