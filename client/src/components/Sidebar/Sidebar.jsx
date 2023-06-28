import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";
import { useState } from "react"; 
import { encode as uint8ToBase64 } from "uint8-to-base64";
import { getNonce, removeFriend as removeFriendApi, getFriends } from "../../api/";

import Header from "../Header/Header";
import Contact from "../Contact/Contact";
import { useStore } from "../../AppContext";
import "./Sidebar.css";

const encryptData = async (encoder, key, data) => {
	data = encoder.encode(JSON.stringify(data));
	let encryptedData = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, key, data);
	encryptedData = new Uint8Array(encryptedData);
	const b64encoded = uint8ToBase64(encryptedData);
	return b64encoded;
}

const Sidebar = ({ user }) => {
	const navigate = useNavigate();
	const { state, dispatch } = useStore();
	const [ selectedIndex, setSelectedIndex ] = useState(null);

	const goHome = e => {
		navigate("/");
	};

	const onContactSelect = idx => {
		return () => {
			setSelectedIndex(() => idx);
		};
	};

	const removeFriend = user => {
		return async (e) => {
			e.preventDefault();
			e.stopPropagation();

			if (!state.user)
			{
				console.log("non sei loggato");
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

				const data = {
					userEmail: state.user.email,
					friendEmail: user.email,
				};
				
				const encryptedData = await encryptData(encoder, key, data);

				response = await removeFriendApi({encryptedText: encryptedData, _csrf: state.token,});
				console.log(response.data);
				
				const encryptedEmail = await encryptData(encoder, key, state.user.email);
				response = await getFriends(encryptedEmail);

				const action = {type: "displayFriend", payload: {friends: response.data.friends}};
				dispatch(action);
				dispatch({type: "token", payload: { token: response.data.token, }});
				
				setSelectedIndex(() => null);
				navigate("/");
			} catch (err) {
				console.error(err.message);
			}
		};
	};

	return (
		<div className="app__sidebar">
			<Header user={user}/>
			<div onClick={goHome} style={{display: "flex", alignItems: "center", color: "white"}}>
				<HomeIcon />
				Torna alla Home
			</div>
			{ (state.user && state.user.friends && state?.user?.friends?.length !== 0) ? (
				state.user.friends.map((friend, idx) => (
					<Contact 
						preOnClickHook={onContactSelect(idx)} 
						style={{backgroundColor: (selectedIndex === idx ? "#fdca00" : "rgb(120,120,120)") }} 
						key={idx} 
						user={{
							avatar: friend.avatarURL,
							name: friend.name,
							email: friend.email,
						}}
						removeFriend={removeFriend}
					/>
				))
			) : null}		
		</div>
	);
};

export default Sidebar;
