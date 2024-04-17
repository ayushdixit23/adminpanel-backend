const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const Redis = require("ioredis");
const http = require("http").Server(app);
const io = require("socket.io")(http);

//import routes
// const userAuth = require("./routes/authRoutes");
// const chatRoutes = require("./routes/convRoutes");
// const messageRoutes = require("./routes/message");
// const communityRoutes = require("./routes/community");
// const topicRoutes = require("./routes/topic");
// const productRoutes = require("./routes/product");
// const postRoutes = require("./routes/post");
// // const prositeRoutes = require("./routes/prosite");
// const commentRoutes = require("./routes/comment");
// const reviewRoutes = require("./routes/review");
// const orderRoutes = require("./routes/order");
// const glimpseRoutes = require("./routes/glimpse");
// const replyRoutes = require("./routes/reply");
// const questionsRoutes = require("./routes/questions");
// const searchRoutes = require("./routes/searc");
const adminRoutes = require("./routes/admin");
// const notificationRoutes = require("./routes/notification");
// const libraryRoutes = require("./routes/library");
// const testRoutes = require("./routes/test");
// const workRoutes = require("./routes/workspace");
const adRoutes = require("./routes/Ads");
// const memRoutes = require("./routes/membership");
const prosRoutes = require("./routes/pros");
const workspacev1 = require("./routes/WorkspaceV1");
const Community = require("./models/community");
// const Order = require("./models/orders");
const User = require("./models/userAuth");
const Advertiser = require("./models/Advertiser");
const Ads = require("./models/Ads");
const Posts = require("./models/post");
const Analytics = require("./models/Analytics");
const Montenziation = require("./models/Montenziation");
const Request = require("./models/Request");

require("dotenv").config();

//middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use("/api", adminRoutes);
app.use("/api", adRoutes);
app.use("/api/v1", workspacev1);
app.use("/api/v1", prosRoutes);

//connect to DB
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.PRODDB).then(() => {
      console.log("DB is connected");
    });
  } catch (err) {
    console.log(err);
  }
};

connectDB();

const connectApp = () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
connectApp();