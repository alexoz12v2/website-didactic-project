"use strict";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
	authorEmail: {
		type: String,
	},
	content: String,
	dateSent: Date, // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
}, { _id: false, });

const chatSchema = new Schema({
	// utenti interlocutori. Nota: se fai override della proprieta' _id, la devi settare manualmente
	id: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: "User",
		}],
		validator: function() { return this._id.length === 2; },
		required: true,
	},
	messages: [messageSchema],
});

const ChatModel = mongoose.model("Chat", chatSchema);

export default ChatModel;
