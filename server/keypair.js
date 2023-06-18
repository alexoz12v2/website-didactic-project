"use strict";
import { generateKeyPairSync } from "crypto";
import { config } from "dotenv";
import { pem2jwk } from "pem-jwk";
config();

// generate solo una volta
const { keyJWK, privateKey } = (() => {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
	modulusLength: 2048, // length in bits chiavi
	publicKeyEncoding: {
	    type: "pkcs1", // raccomandato da node docs
	    format: "pem",
	},
	privateKeyEncoding: {
	    type: "pkcs1", // raccomandato da node docs
	    format: "pem",
	    //cipher: "aes-256-ecb",
	    //passphrase: process.env.KEY_PASS,
	}
    });

    const keyJWK = pem2jwk(publicKey);
    console.log(keyJWK);

    // TODO remove 
    console.log(privateKey);
    console.log(pem2jwk(privateKey));
    
    return { keyJWK, privateKey };
})();

export { keyJWK as publicKey, privateKey };
