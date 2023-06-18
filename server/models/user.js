"use strict";
import mongoose, { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
	//email: {
	//	type: String,
	//	required: true,
	//	unique: true,
	//	match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
	//},
	//hashedPassword: {
	//	type: String,
	//	required: true,
	//	minLength: 8,
	//},
	name: {
		first: {
			type: String,
			lowercase: true, // converte a lowercase
			required: true,
			minLength: 1,
			trim: true,
		},
		last: { 
			type: String,
			lowercase: true,
			//required: true, // TODO github profile non ha nome e cognome obbligatori. Uso allora username come first e "" come last
			//minLength: 1,
			trim: true,
		},
	},
	friends: [
		{ type: Schema.Types.ObjectId, ref: "User" }
	],
	// TODO add icon, and more stuff...
}, {
	virtuals: { // contiene campi derivati che non sono memorizzati nel database
		fullName: {
			get() { return this.name.first + " " + this.name.last; },
			set(fullName) { 
				this.name.first = fullname.substr(0, fullname.indexOf(" ")); 
				this.name.last  = fullname.substr(fullname.indexOf(" ") + 1); 
			}
		}
	},
	// toJSON: { virtuals: true; }, // uncomment se vuoi che JSON.stringify() o document.toJSON() includa i virtuals
	// collection: "users", // uncomment se vuoi customizzare nome collection (default e' versione plurale lowercase del primo argomento di model())
});

// mongoose docs: schema plugins sono una feature che permette l'aggiunta di logica comune a piu 
// schemas, eg popolarli con proprieta comuni. in particolare, l'argomento di plugin e' una 
// function (schema, options). passpostLocalMongoose e' un hook definito da riga 8 in
// https://github.com/saintedlama/passport-local-mongoose/blob/main/index.js
const options = {
	saltlen: process.env.SALT_LEN,
	usernameField: "email",
	hashField: "hashedPassword",
};
userSchema.plugin(passportLocalMongoose, options);
console.log(userSchema)
const userModel = mongoose.model("User", userSchema);

export default userModel;
