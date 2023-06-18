import { encode as uint8ToBase64, decode as base64ToUint8 } from "uint8-to-base64";
import { getNonce } from "../../api/";

const NonceForm = (props) => {
	const { postCallback, children, ...restProps } = props;

	const callback = async (formEvent) => {
		formEvent.preventDefault();
		formEvent.stopPropagation();
		const formElements = `input, select, textarea, button, fieldset, legend, datalist, output, option, optgroup`;
		const elements = formEvent.target.querySelectorAll(formElements);
		const encoder = new TextEncoder();
		const decoder = new TextDecoder("utf8");

		try {
			const response = await getNonce();
			if (response.status !== 200) 
				throw new Error(`failed request with state ${response.status}`);

			const values = [];
			elements.forEach((elem,index) => { 
				values.push({
					name: elem.name,
					value: elem.value.toString(),
				});
			});
			const keyToImport = response.data.nonce;
			const key = await window.crypto.subtle.importKey("jwk", keyToImport, {name: "RSA-OAEP", hash: {name: "SHA-256"}}, false, ["encrypt"]);

			const data = encoder.encode(JSON.stringify(values));
			console.log("Data---------------------------------------------- ")
			console.log(JSON.stringify(values));
			console.log("Encoded Data---------------------------------------------- ")
			console.log(data);
			let encryptedData = await window.crypto.subtle.encrypt({name: "RSA-OAEP"}, key, data);
			encryptedData = new Uint8Array(encryptedData);
			console.log("Encrypted Data---------------------------------------------- ")
			console.log(encryptedData);

			const b64encoded = uint8ToBase64(encryptedData);
			console.log(b64encoded);

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
