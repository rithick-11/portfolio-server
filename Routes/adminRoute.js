import { Router } from "express";
import Project from "../Model/ProjectModal.js";
import Admin from "../Model/adminModel.js";
import vistorCount from "../Model/visterCount.js";
import Contact from "../Model/contactModel.js";

const router = Router();



router.post("/add/user", async (req, res) => {
  const newAdmin = await Admin.create(req.body);
  res.json(newAdmin);
});

router.post("/login", async (req, res) => {
  const daUser = await Admin.findOne({ username: req.body.username });
  if (daUser !== null) {
    if (daUser.password === req.body.password) {
      res.json({token:"lklaslaksdaldlsdlasdlalklsmdmal;km",msg:"login success fully"});
    } else {
      res.status(404).json({ msg: "worng Password" });
    }
  } else {
    res.status(404).json({ msg: "user not found" });
  }
});

router.post("/add/project", async (req, res) => {
  const userData = req.body;
  const newProject = await Project.create(userData);
  res.json(newProject);
});

router.get("/vist-count", async (req, res) => {
  const count = await vistorCount.findOne({ _id: "66b1c9183f675b3f2078b814" }).sort({RecentVist:1});
  const messages = await Contact.find().sort({createdAt: -1})
  res.json({count:count.count, recentVist: count.RecentVist, messages});
});


export default router;
