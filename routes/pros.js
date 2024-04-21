const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const fs = require("fs");
require("dotenv").config();
const axios = require("axios");
const User = require("../models/userAuth");
const uuid = require("uuid").v4;
const BUCKET_NAME = process.env.BUCKET_NAME;
// const POST_BUCKET = process.env.POST_BUCKET;

const s3 = new S3Client({
	region: process.env.BUCKET_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_KEY,
	},
});

router.post("/uploaddata/:id", upload.single("file"), async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		if (user) {
			if (user.contents.length < 5) {
				const uuidString = uuid();
				const objectName = `${Date.now()}${uuidString}${req.file.originalname}`;
				const result = await s3.send(
					new PutObjectCommand({
						Bucket: BUCKET_NAME,
						Key: objectName,
						Body: req.file.buffer,
						ContentType: req.file.mimetype,
					})
				);
				await User.updateOne({ _id: id }, { $push: { contents: objectName } });
				const link = process.env.URL + objectName;
				res.status(200).json({ success: true, link });
			} else {
				res.status(203).json({ success: false, premium: true, message: "Maxiumum Uploading Limit Exceeded" });
			}
		} else {
			res.status(404).json({ message: "User not found", success: false });
		}
	} catch (e) {
		res.status(409).json({
			message: e.message,
			success: false,
		});
	}
});

router.get("/getimage/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		if (user) {
			let elinks = [];
			for (let i = 0; i < user.contents.length; i++) {
				let a = process.env.URL + user.contents[i];
				elinks.push(a);
			}
			const links = elinks.reverse()
			res.status(200).json({ links, success: true });
		} else {
			res.status(404).json({ message: "User not found!", success: false });
		}
	} catch (e) {
		console.log(e);
		res
			.status(400)
			.json({ message: "Something went wrong...", success: false });
	}
});

router.post("/savetemppro/:id", async (req, res) => {
	try {
		console.log(req.body)
		const { id } = req.params;
		const user = await User.findById(id);
		const { store, about, community, contact, curr_template1, curr_template2, webt } = req.body;

		if (user) {
			user.prositeweb_template = curr_template1
			user.prositemob_template = curr_template2
			user.prositepic = webt
			if (store !== undefined && store !== null) {
				user.showStoreSection = store;
			}
			if (community !== undefined && community !== null) {
				user.showCommunitySection = community;
			}
			if (about !== undefined && about !== null) {
				user.showAboutSection = about;
			}
			if (contact !== undefined && contact !== null) {
				user.showContact = contact;
			}
			await user.save()
			res.status(200).json({ success: true });
		} else {
			res.status(404).json({ message: "User not found", success: false });
		}
	} catch (e) {
		console.log(e)
		res.status(409).json({
			message: e.message,
			success: false,
		});
	}
});

router.post("/getprosite", async (req, res) => {
	try {
		const { username } = req.body;
		const atIndex = username.indexOf("@");

		if (atIndex === -1) {
			res
				.status(400)
				.json({ message: "Invalid username format", success: false });
			return;
		}
		const u = username.substring(atIndex + 1);

		const user = await User.findOne({ username: u });

		if (user) {
			res.status(200).json({ success: true, prosite: user.prositemob_template });
		} else {
			res.status(404).json({ success: false, message: "User not found!" });
		}
	} catch (e) {
		console.log(e);
		res
			.status(400)
			.json({ message: "Something went wrong...", success: false });
	}
});

router.post("/setprefences/:id", async (req, res) => {
	try {
		const { store, community, about } = req.body
		const { id } = req.params
		const user = await User.findById(id)
		if (!user) {
			return res.status(400).json({ success: false })
		}
		if (store !== undefined && store !== null) {
			user.showStoreSection = store;
		}
		if (community !== undefined && community !== null) {
			user.showCommunitySection = community;
		}
		if (about !== undefined && about !== null) {
			user.showAboutSection = about;
		}
		await user.save()
		res.status(200).json({ success: true })
	} catch (error) {
		console.log(error)
	}
})

router.delete("/deletetemp/:id", async (req, res) => {
	try {
		const { id } = req.params
		const user = await User.findById(id)
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found!" })
		}
		user.prositemob_template = undefined
		user.prositeweb_template = undefined
		await user.save()
		res.status(200).json({ success: true, message: "Template Deleted!" })
	} catch (error) {
		console.log(error)
	}
})

module.exports = router;
