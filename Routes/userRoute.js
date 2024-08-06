import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Project from "../Model/ProjectModal.js";
import User from "../Model/UserModel.js";

import usetAuthentication from "../MiddleWare/userAuthentication.js";
import isUserAuthorized from "../MiddleWare/isUserAuthorized.js";
import vistorCount from "../Model/visterCount.js";

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
  const data = await vistorCount.updateOne(
    { _id: "66b1c9183f675b3f2078b814" },
    { $inc: { count: 1 }, $push: { RecentVist: new Date() } },
  );
  res.json(data);
});

router.get("/vist-count", async (req, res) => {
  const count = await vistorCount.findOne({ _id: "66b1c9183f675b3f2078b814" });
  res.json(count);
});

router.get("/project", isUserAuthorized, async (req, res) => {
  const projectList = await Project.find();
  if (req.body.userAuthorized) {
    const { username } = req.body.user;
    const authProject = projectList.map((each) => {
      const { likedUser } = each;
      const isLiked = likedUser.some((each) => each.username === username);
      return {
        project: each,
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
        project: each,
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
      const prject = await Project.updateOne(
        { _id: pId },
        { $push: { likedUser: liked } }
      );
      res.json({ msg: "Thanks for liking" });
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

router.get("/data", usetAuthentication, async (req, res) => {
  const {username} = req.body.user
  const userData = await User.findOne({username: username},{password:0,email:0})
  res.json(userData)
})


export default router;
