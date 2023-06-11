
import Google from "../../assets/google.png";
import GitHub from "../../assets/github.png";
import "./LoginForm.css";

// TODO refactor codice ripetuto
// TODO password criptata
// TODO cambia il post action nel form
const LoginForm = () => {
	const google = () => {};
	const github = () => {};

	return (
		<div className="app__chatbox">
			<div className="app__login-wrapper">
				<h1 className="app__login-title">Choose a Login Method</h1>
				<div className="app__login-left-box">
					<div className="app__login-button google" onClick={google}>
						<img src={Google} alt="" className="icon" />
						Google
			  		</div>
			  		<div className="app__login-button github" onClick={github}>
						<img src={GitHub} alt="" className="icon" />
						Github
			  		</div>
				</div>
				<div className="app__login-center-box">
			  		<div className="line" />
			  		<div className="or">OR</div>
				</div>
				<form className="app__login-right-box" action="/login" method="post">
			  		<input type="text" name="username" placeholder="Username" />
			  		<input type="text" name="password" placeholder="Password" />
			  		<input type="submit" name="submitButton" className="submit"/><label for="submitButton">Login</label>
				</form>
		  	</div>
		</div>
	);
};

export default LoginForm;
