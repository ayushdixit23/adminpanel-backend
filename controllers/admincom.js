const Community = require("../models/community");
const Report = require("../models/reports");
const Admin = require("../models/admins");
const Monetizereq = require("../models/Montenziation");
const Store = require("../models/Request");
const Delivery = require("../models/deliveries");
const User = require("../models/userAuth");
const Minio = require("minio");
const Ads = require("../models/Approvals");
const Order = require("../models/orders");
require("dotenv").config()

const minioClient = new Minio.Client({
  endPoint: "minio.grovyo.xyz",
  useSSL: true,
  accessKey: "shreyansh379",
  secretKey: "shreyansh379",
});

async function generatePresignedUrl(bucketName, objectName, expiry = 604800) {
  try {
    const presignedUrl = await minioClient.presignedGetObject(
      bucketName,
      objectName,
      expiry
    );
    return presignedUrl;
  } catch (er) {
    console.error(er);
    throw new Error("Failed to generate presigned URL");
  }
}

exports.getCommunities = async (req, res) => {
  try {
    const data = await Community.find();
    const comlength = data.length;
    res.status(200).json(comlength);
  } catch (e) {
    res.status(400).json({ error: "User not found" });
  }
};
exports.getreports = async (req, res) => {
  try {
    const data = await Report.find();
    //  console.log(data);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ error: "User not found" });
  }
};
exports.getactiveusers = async (req, res) => {
  try {
    const data = await Admin.find();
    //  console.log(data);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ error: "User not found" });
  }
};
exports.getmonetization = async (req, res) => {
  try {
    const data = await Monetizereq.find();
    //  console.log(data);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ error: "User not found" });
  }
};
exports.getstore = async (req, res) => {
  try {
    const data = await Store.find();
    //  console.log(data);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ error: "User not found" });
  }
};
exports.approvestore = async (req, res) => {
  try {
    const { userid, statuss } = req.body;
    const storee = await Store.findOne({ userid }); // Assuming you want to find by userid
    if (!storee) return res.status(402).send("Store does not exist");
    else {
      storee.status = statuss;
      await storee.save(); // Save the changes
      const user = await User.findById(userid);
      user.isStoreVerified = true;
      await user.save();
      res.status(200).json({ message: "Store status updated successfully" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Error updating store status" });
  }
};
exports.getdeliveries = async (req, res) => {
  try {
    const data = await Delivery.find();
    //  console.log(data);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ error: "User not found" });
  }
};
exports.getads = async (req, res) => {
  try {
    const data = await Ads.find();
    //  console.log(data);
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ error: "User not found" });
  }
};
exports.approveads = async (req, res) => {
  try {
    const { id, status } = req.body;
    const Adss = await Ads.findOne({ id }); // Assuming you want to find by userid
    if (!Adss) return res.status(402).send("Ad does not exist");
    else {
      Adss.status = status;
      await Adss.save(); // Save the changes
      // const user = await User.findById(userid);
      // user.isStoreVerified = true;
      // await user.save();
      res.status(200).json({ message: "Ad status updated successfully" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Error updating ad status" });
  }
};
exports.latestUser = async (req, res) => {
  try {
    //  console.log("first")
    const data = (await User.find()).reverse();

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: "User not found" });
  }
};

exports.orderSearch = async (req, res) => {
  try {
    const { oid } = req.body
    const order = await Order.findOne({ orderId: oid })
    const pdf = process.env.BILLING_URL + order.orderId
    res.status(200).json({ success: true, pdf })
  } catch (error) {
    res.status(400).json({ error: "Something Went Wrong" });
    console.log(error)
  }
}