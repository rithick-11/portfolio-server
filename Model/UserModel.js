import mongoose from "mongoose";
import validator from 'validator';

const userShema = mongoose.Schema({
    username:{
        type:String,
        unique:[true, "username already exist"],
    },
    name:String,
    email:{
        type:String,
        unique:[true, "email already exist"],
        validate : [validator.isEmail, "invalide e-mail"]
    },
    password:String,
    createdAt:Date
})

const User = mongoose.model("user", userShema)

export default User

