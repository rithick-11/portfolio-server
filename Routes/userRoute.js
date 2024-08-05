import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Project from "../Model/ProjectModal.js";
import User from "../Model/UserModel.js";

import usetAuthentication from "../MiddleWare/userAuthentication.js";
import isUserAuthorized from "../MiddleWare/isUserAuthorized.js";

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

router.get("/project", isUserAuthorized, async (req, res) => {
  const projectList = await Project.find();
  if (req.body.userAuthorized) {
    const { username } = req.body.user;
    res.json(projectList)
  } else {
    res.json(projectList);
  }
});

router.put("/add/like-project/:id", usetAuthentication, async (req, res) => {
  const pId = req.params.id;
  const { user } = req.body;
  const { likedUser } = await Project.findOne({ _id: pId });
  if (likedUser.some((each) => each.userId === user.userId)) {
    res.json({ msg: "already liked" });
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
    res.json(prject);
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

export default router;
