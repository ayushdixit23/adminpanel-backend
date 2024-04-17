const mongoose = require("mongoose")

const formScehma = new mongoose.Schema({
	name: String,
	doc: String,
	batch: String,
	phone: String,
	email: String,
	job: String,
	message: String
})

module.exports = mongoose.model("Form", formScehma)