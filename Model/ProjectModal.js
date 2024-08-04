import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
    name:String,
    category: String,
    projectImg: String ,
    desc: String,
    siteLink: String,
    likeCount:Number,
})

const project =mongoose.model("project", projectSchema)

export default project