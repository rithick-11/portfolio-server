import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRouter from "./Routes/userRoute.js";
import adminRouter from "./Routes/adminRoute.js";
import CyberLaneVistCount from "./Model/CyberLaneModel.js";

dotenv.config();

const app = express();

const startServerAndConnectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongoDb connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`server is running at http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

app.use(express.json());
app.use(cors());

///app routes

app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  const record = {
    location: req.headers["x-vercel-ip-city"],
    platform: req.headers["sec-ch-ua-platform"],
    browser: req.headers["sec-ch-ua"],
  };
  res.json({ data: req.headers, record });
});

app.get("/api/cyberlane/vistcount", async (req, res) => {
  const record = {
    location: req.headers["x-vercel-ip-city"],
    platform: req.headers["sec-ch-ua-platform"],
    browser: req.headers["sec-ch-ua"],
  };
  const data = await CyberLaneVistCount.updateOne(
    { _id: "66b1c9183f675b3f2078b814" },
    { $inc: { count: 1 }, $push: { RecentVist: { date: new Date(), record } } }
  );
  res.json(data);
});

app.get("/cyberlanevist/count", async (req, res) => {
  const count = await CyberLaneVistCount.findOne({
    _id: "66b1c9183f675b3f2078b814",
  });
  res.json({ count });
});

startServerAndConnectDb();
