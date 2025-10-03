import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
  name: String,
  category: String,
  projectImg: String,
  desc: String,
  siteLink: String,
  likedUser: [],
  order: Number,
  techStack: [String],
  sourceCode: String,
});

const Project = mongoose.model("project", projectSchema);

export default Project;
