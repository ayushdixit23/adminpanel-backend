const express = require("express");
const multer = require("multer");
const {
  getuserstotal,
  findUser,
  blockuser,
  findCreator,
  findBusiness,
  findDeliveryPartners,
  findcoms,
  blockcomms,
  findposts,
  blockposts,
  blockproducts,
  findproducts,
  findreports,
  markreports,
  getdp,
  getalldata,
  findandblock,
  allapprovals,
  approvalactions,
  refresh,
  adminlogin,
  getCommunitiesforMon,
  communitiesRequests,
  store,
  approveStoreofUser,
  productApproval,
  allproductApprovals,
  dashboard,
  storecount,
  fetchads,
  fetchBanks,
  approveBank,
  approveAds,
  formUpload,
  forms,
  latestUserstofetch,
} = require("../controllers/admin");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/totalusers/:userId", getuserstotal);
router.post("/finduser/:useId/:id", findUser);
router.post("/findcreator/:userId/:id", findCreator);
router.post("/findbusiness/:userId/:id", findBusiness);
router.post("/finddeliverypartner/:userId/:id", findDeliveryPartners);
router.post("/findcomms/:comId/:id", findcoms);
router.post("/commsblock/:comId/:id", blockcomms);
router.post("/blockuser/:userId/:id", blockuser);
router.post("/findposts/:postId/:id", findposts);
router.post("/blockposts/:postId/:id", blockposts);
router.post("/findproducts/:prodId/:id", findproducts);
router.post("/blockproducts/:prodId/:id", blockproducts);
router.post("/findreports/:id", findreports);
router.post("/markreports/:reportId/:id", markreports);
router.get("/getdp/:userId", getdp);

//new routes
router.get("/getalldata/:id", getalldata);
router.post("/findandblock/:userId", findandblock);
router.get("/allapprovals/:userId", allapprovals);
router.post("/approvalactions/:userId", approvalactions);


// my
router.post("/adminlogin", adminlogin);
router.post("/refresh", refresh);
router.get("/v1/getCommunitiesforMon", getCommunitiesforMon);
router.post("/requests/:id", communitiesRequests);
router.get("/v1/store", store);
router.post("/approveStoreofUser/:id", approveStoreofUser);
router.post("/productApproval/:id/:pid", productApproval);
router.post("/allproductApprovals/:id", allproductApprovals);
router.post("/approveAds/:id", approveAds);
router.get("/dashboard", dashboard);
router.get("/v1/storecount", storecount);
router.get("/v1/fetchads", fetchads);
router.get("/v1/fetchBanks", fetchBanks);
router.post("/approveBank/:id", approveBank);
router.post("/v1/form", upload.single("doc"), formUpload);
router.get("/v1/adminform", forms);

module.exports = router;
