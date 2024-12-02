import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Project from "../Model/ProjectModal.js";
import User from "../Model/UserModel.js";
import Contact from "../Model/contactModel.js";

import usetAuthentication from "../MiddleWare/userAuthentication.js";
import isUserAuthorized from "../MiddleWare/isUserAuthorized.js";
import vistorCount from "../Model/visterCount.js";
import { now } from "mongoose";

const router = Router();

const handelErr = (err) => {
  let errors = { email: "", username: "" };

  if (err.code === 11000) {
    if (err.message.includes("username")) {
      return "username already exist";
    }
    return "E-mail already exist";
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (errors.email === "") {
    return errors.username;
  } else {
    return errors.email;
  }
};

router.get("/count", async (req, res) => {
  // const data = await vistorCount.create({count:0, RecentVist: []})
  const record = {
    location: req.headers["x-vercel-ip-city"],
    platform: req.headers["sec-ch-ua-platform"],
    browser: req.headers["sec-ch-ua"],
  };
  const data = await vistorCount.updateOne(
    { _id: "66b1c9183f675b3f2078b814" },
    { $inc: { count: 1 }, $push: { RecentVist: { date: new Date(), record } } }
  );
  res.json(data);
});

router.get("/vist-count", async (req, res) => {
  const count = await vistorCount.findOne({ _id: "66b1c9183f675b3f2078b814" });
  const messages = await Contact.find();
  res.json({ count, messages });
});

router.get("/project", isUserAuthorized, async (req, res) => {
  const projectList = await Project.find().sort({ order: 1 });
  if (req.body.userAuthorized) {
    const { username } = req.body.user;
    const authProject = projectList.map((each) => {
      const { likedUser } = each;
      const isLiked = likedUser.some((each) => each.username === username);
      return {
        _id: each._id,
        name: each.name,
        desc: each.desc,
        projectImg: each.projectImg,
        siteLink: each.siteLink,
        likes: likedUser.length,
        isLiked,
      };
    });
    res.json(authProject);
  } else {
    res.json(
      projectList.map((each) => ({
        _id: each._id,
        name: each.name,
        desc: each.desc,
        projectImg: each.projectImg,
        siteLink: each.siteLink,
        likes: each.likedUser.length,
        isLiked: false,
      }))
    );
  }
});

router.put("/add/like-project/:id", usetAuthentication, async (req, res) => {
  const pId = req.params.id;
  const { user } = req.body;
  const { likedUser } = await Project.findOne({ _id: pId });
  try {
    if (likedUser.some((each) => each.userId === user.userId)) {
      res.status(404).json({ msg: "Already liked" });
    } else {
      const liked = {
        userId: user.userId,
        username: user.username,
        likedAt: new Date(),
      };
      const resp = await Project.updateOne(
        { _id: pId },
        { $push: { likedUser: liked } }
      );
      const projectDb = await Project.findOne({ _id: pId });
      const likeCount = projectDb.likedUser.length;
      res.json({ msg: "Thanks for liking", likeCount });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/singup", async (req, res) => {
  const newPassword = req.body.password;
  const password = await bcrypt.hash(newPassword, 10);
  const createdAt = new Date();
  try {
    const newUser = await User.create({ ...req.body, password, createdAt });

    res.json({ msg: "user has been created successfully" });
  } catch (err) {
    const errMsg = handelErr(err);
    res.status(401).json({ msg: errMsg });
  }
});

router.post("/add-guest", async (req, res) => {
  const ranNum = Math.floor(Math.random() * (100000 + 1000)) + 1000;
  const guestUser = {
    username: `guest-${ranNum}`,
    name: `guest${ranNum}`,
    email: `guest${ranNum}@mail.com`,
    password: "password",
    createdAt: new Date(),
  };
  try {
    res
      .status(201)
      .json({ guest: guestUser, msg: "Are you okey with this data" });
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ msg: "sorry we cannot genarate dummy data from server" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const getUser = await User.findOne({ username: username });
  if (getUser !== null) {
    if (await bcrypt.compare(password, getUser.password)) {
      const token = await jwt.sign(
        { userId: getUser._id, username: getUser.username },
        "rithick"
      );
      res
        .status(200)
        .json({ token, msg: `hey, ${getUser.name} you login successfully` });
    } else {
      res.status(404).json({ msg: "worng Password" });
    }
  } else {
    res.status(404).json({ msg: "User not found" });
  }
});

router.get("/auth/project", async (req, res) => {
  const projectList = await Project.find();
  res.json("ok");
});

router.post("/contact", async (req, res) => {
  const newMessage = await Contact.create({
    ...req.body,
    createdAt: new Date(),
  });
  console.log(req.body);
  res.json({ msg: "Thanks for message " });
});

router.get("/data", usetAuthentication, async (req, res) => {
  const { username } = req.body.user;
  const userData = await User.findOne(
    { username: username },
    { password: 0, email: 0 }
  );
  res.json(userData);
});

export default router;
