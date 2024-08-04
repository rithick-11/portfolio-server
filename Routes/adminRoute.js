import { Router } from "express";
import Project from "../Model/ProjectModal.js";

const router = Router()

router.post("/add/project", async (req, res) => {
    const userData = req.body
    const newProject = await Project.create(userData)
    res.json(newProject)
} )

export default router