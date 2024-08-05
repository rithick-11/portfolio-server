import { Router } from "express";
import Project from "../Model/ProjectModal.js";
import Admin from "../Model/adminModel.js";

const router = Router();

router.post("/add/user", async (req, res) => {
  const newAdmin = await Admin.create(req.body);
  res.json(newAdmin);
});

router.post("/login", async (req, res) => {
  const daUser = await Admin.findOne({ username: req.body.username });
  if (daUser !== null) {
    if (daUser.password === req.body.password) {
      res.json(true);
    } else {
      res.status(403).json({ msg: "worng Password" });
    }
  } else {
    res.status(403).    json({ msg: "user not found" });
  }
});

router.post("/add/project", async (req, res) => {
  const userData = req.body;
  const newProject = await Project.create(userData);
  res.json(newProject);
});

export default router;
