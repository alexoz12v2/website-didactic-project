import { useState } from "react";
import { encode as uint8ToBase64 } from "uint8-to-base64";

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';

import { getNonce, getUserInfoByEmail, addFriend, getFriends } from "../../api/";
import { useStore } from "../../AppContext";

import "./Home.css";

const encryptData = async (encoder, key, data) => {
	data = encoder.encode(JSON.stringify(data));
	let encryptedData = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, key, data);
	encryptedData = new Uint8Array(encryptedData);
	const b64encoded = uint8ToBase64(encryptedData);
	return b64encoded;
}

const Home = () => {
	const [ hidden, setHidden ] = useState(true);
	const { state, dispatch } = useStore();
	const searchFriend = e => {
		setHidden(() => false);
	};

	const queryFriend = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		console.log(state.user.friends.filter(friend => friend.email === e.target.elements.email.value));
		if (state.user.friends.filter(friend => friend.email === e.target.elements.email.value).length !== 0)
		{
			console.log("hai gia' questo amico");
			return;
		}

		const encoder = new TextEncoder("utf8");
		
		try {
			let response = await getNonce();
			if (response.status !== 200) 
				throw new Error(`failed request with state ${response.status}`);

			const keyToImport = response.data.nonce;
			const key = await window.crypto.subtle.importKey("jwk", keyToImport, {name: "RSA-OAEP", hash: {name: "SHA-256"}}, false, ["encrypt"]);
			console.log(state.token);

			const encryptedEmail = await encryptData(encoder, key, e.target.elements.email.value);

			console.log("checkpoint 0");
			response = await getUserInfoByEmail(encryptedEmail);
			dispatch({type: "token", payload: { token: response.data.token }});
			console.log(state.token);
			console.log(response.data.token);
			//const friendDisplayData = response.data;

			if (response.status === 404)
			{
				console.log(`Non e' stato trovato un utente con email ${e.target.elements.email.value}`);
				return;
			}

			console.log("checkpoint 1");
			const requestData = await encryptData(encoder, key, {userEmail: state.user.email, friendEmail: e.target.elements.email.value});
			response = await addFriend(requestData, response.data.token);

			console.log("checkpoint 2");
			const encryptedUserEmail = await encryptData(encoder, key, state.user.email);
			response = await getFriends(encryptedUserEmail);

			const action = {
				type: "displayFriend",
				payload: {
					friends: response.data.friends,
				},
			}
			dispatch(action);

			dispatch({type: "token", payload: { token: response.data.token }});
			console.log(state.token);
			console.log(response.data.token);

		} catch (err) {
			console.error(err);
		}
	};

	const closeSearch = e => {
		setHidden(() => true);
	};

	return (
		<div className="app__home--container" style={{
		}}>
			<span>
		Benvenuto su BuddyBuzz! Chatta senza limiti, ridi senza sosta: qui sei sempre in buona compagnia! Cosa aspetti? <strong>Clicca qua sotto</strong>, aggiungi i tuoi amici e avvia una conversazione con loro.
			</span>
		{state?.user ? 
			(<>
				<PersonAddIcon sx={{
					color: "white",
					fontSize: "600%",
					border: "3px solid white",
					borderRadius: 100,
				}} onClick={searchFriend}/>
				<form onSubmit={queryFriend} className={"home__form " + (hidden ? "hidden" : "")}>
					<input type="text" name="email" placeholder="inserisci email amico" />
					<input type="submit" value="cerca" />
					<CloseIcon onClick={closeSearch}/>
				</form>
			</>) 
			: null
		}
		</div>
	);
};

export default Home;
