import mongoose from "mongoose";

const vistorCountSchema = mongoose.Schema({
    count:Number,
    RecentVist:[Date]
})

const vistorCount =mongoose.model("vistorCount", vistorCountSchema)

export default vistorCount