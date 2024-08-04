import { Router } from "express";
import Project from "../Model/ProjectModal.js";

const router = Router()

router.get("/project", async (req, res) => {
    const projectList = await Project.find()
    res.json(projectList)
})

export default router