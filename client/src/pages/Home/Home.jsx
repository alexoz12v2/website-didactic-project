import { useState } from "react";
import { encode as uint8ToBase64 } from "uint8-to-base64";

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';

import { getNonce, getUserInfoByEmail } from "../../api/";

import "./Home.css";

const Home = () => {
	const [hidden, setHidden] = useState(true);
	const searchFriend = e => {
		setHidden(() => false);
	};

	const queryFriend = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		const encoder = new TextEncoder("utf8");
		
		try {
			let response = await getNonce();
			if (response.status !== 200) 
				throw new Error(`failed request with state ${response.status}`);

			const keyToImport = response.data.nonce;
			const key = await window.crypto.subtle.importKey("jwk", keyToImport, {name: "RSA-OAEP", hash: {name: "SHA-256"}}, false, ["encrypt"]);

			const data = encoder.encode(JSON.stringify(e.target.elements.email.value));
			let encryptedData = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, key, data);
			encryptedData = new Uint8Array(encryptedData);
			const b64encoded = uint8ToBase64(encryptedData);

			response = await getUserInfoByEmail(b64encoded);
			console.log(response.data);

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
		</div>
	);
};

export default Home;
