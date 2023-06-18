import { encode as uint8ToBase64 } from "uint8-to-base64";
import { getNonce } from "../../api/";

const NonceForm = (props) => {
	const { postCallback, children, ...restProps } = props;

	const callback = async (formEvent) => {
		formEvent.preventDefault();
		formEvent.stopPropagation();

		// TODO work in progress
		const formData = new FormData(formEvent.target, formEvent.target.querySelector("input[type='submit']"));
		const encoder = new TextEncoder("utf8");
		console.log(formData.values());
		
		const inputData = [];
		const fileData = [];
		let i = 0; let j = 0;
		try {
			const response = await getNonce();
			if (response.status !== 200) 
				throw new Error(`failed request with state ${response.status}`);

			for (const [name, value] of formData) {
				if (value instanceof File) {
					const fileContents = new Uint8Array(await value.arrayBuffer());
					const fileb64 = uint8ToBase64(fileContents);
					console.log(fileb64);
					fileData.push({});
					fileData[j].name = name;
					fileData[j].value = fileb64;
					j++;
				} else {
					inputData.push({});
					inputData[i].name = name;
					inputData[i].value = value;
					i++;
				}
			}
			console.log(inputData);
			console.log(fileData);

			const keyToImport = response.data.nonce;
			const key = await window.crypto.subtle.importKey("jwk", keyToImport, {name: "RSA-OAEP", hash: {name: "SHA-256"}}, false, ["encrypt"]);

			const data = encoder.encode(JSON.stringify(inputData));
			let encryptedData = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, key, data);
			encryptedData = new Uint8Array(encryptedData);

			const b64encoded = uint8ToBase64(encryptedData);
			console.log(b64encoded);

			const postData = {
				encryptedText: b64encoded,
				plainFiles: fileData,
			};
			console.log(postData);

			throw new Error("dsf");
			await postCallback(b64encoded);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<form onSubmit={callback} {...restProps}>
			{ children }
		</form>
	);
};

export default NonceForm;
