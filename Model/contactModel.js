import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
    name:String,
    email:String,
    message:String
})

const Contact =mongoose.model("contact", contactSchema)

export default Contact