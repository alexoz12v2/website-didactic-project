"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
			required: true,
			minLength: 1,
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

const userModel = mongoose.model("User", userSchema);

export default userModel;
