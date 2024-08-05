import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Project from "../Model/ProjectModal.js";
import User from "../Model/UserModel.js";

const router = Router();

const handelErr = (err) =>{
    let errors = {email:"", username:""}

    if(err.code === 11000){
        if(err.message.includes("username")){
            return "username already exist"
        }
        return "E-mail already exist"
    }

    if(err.message.includes("user validation failed")){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }

    if(errors.email === ""){
        return errors.username
    }else{
        return errors.email
    }
    
} 

router.get("/project", async (req, res) => {
  const projectList = await Project.find();
  res.json(projectList);
});

router.post("/add/like-project/:id", async (req, res) => {
  const project = await Project.find({ _id: req.params.id });
  console.log(req.params);
});

router.post("/singup", async (req, res) => {
  const newPassword = req.body.password;
  const password = await bcrypt.hash(newPassword, 10);
  const createdAt = new Date();
  try {
    const newUser = await User.create({ ...req.body, password, createdAt });
    const token = await jwt.sign(
      { userId: newUser._id, username: newUser.username },
      "rithick"
    );
    res.json({ msg: "user has been created successfully" });
  } catch (err) {
    const errMsg = handelErr(err)
    res.status(401).json({msg: errMsg})
  }
});

export default router;