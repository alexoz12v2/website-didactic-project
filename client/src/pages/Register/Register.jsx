import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { NonceForm } from "../../components/";
import { useStore } from "../../AppContext";
import { postNewUserData } from "../../api/"; 

import "./Register.css";

const Register = () => {
	const { state, dispatch } = useStore();
	const [ invalidEmail, setInvalidEmail ] = useState(false);

	const navigate = useNavigate();
	const emailInputElement = useRef(null);

	const validateMail = e => {
		console.log("dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd");
		const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

		const matches = emailInputElement.current.value.match(emailRegex);
		console.log(emailInputElement.current.value)
		if (!matches) 
		{
			setInvalidEmail(() => true);
			setTimeout(() => {
				setInvalidEmail(() => false);
			}, 1000);
			return {
				ok: false,
			};
		}

		return { ok: true, };
	};

	const postRegisterUser = useCallback(async (formData) => {
		try {
			const response = await postNewUserData(formData);

			dispatch({type: "login", payload: {
				user: response.data.user,
				token: response.data.token,
			}});
			console.log(state);

			navigate("/");
		} catch (err) {
			console.error(err);
		}
	}, [navigate, state, dispatch]);

	return (
		<div className="app__registration_box">
			<div className="registration_box-title">Registrati</div>
			<NonceForm postCallback={postRegisterUser} prePostHook={validateMail}>
				<input type="text" placeholder="Inserisci il tuo nome" name="nome" />
				<input type="text" placeholder="Inserisci il tuo cognome" name="cognome" />
				<input ref={emailInputElement} type="text" placeholder="Inserisci la tua email" name="email" />
				<input type="password" placeholder="Inserisci la password" name="password" />

				<input type="file" accept="image/*" id="app__registration_box_image_input" name="avatar" style={{display: "none"}} />

				<label style={{display:"block",color:"black"}} htmlFor="files" 
					onClick={() => {document.getElementById('app__registration_box_image_input').click();}}
				>
					Scegli immagine di profilo (192x192)
				</label>
				<input type="submit" value="Registrati" className="submit" style={{cursor: "pointer"}}/>
			</NonceForm>
			{ invalidEmail ? (
				<div>
					Inserisci una email valida.
				</div>
			) : null }
		</div>
	);
};

export default Register;
