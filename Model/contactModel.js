import mongoose, { now } from "mongoose";

const contactSchema = mongoose.Schema({
    name:String,
    email:String,
    message:String,
    createdAt: Date
})

const Contact =mongoose.model("contact", contactSchema)

export default Contact