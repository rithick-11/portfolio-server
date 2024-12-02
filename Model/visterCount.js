import mongoose from "mongoose";

const vistorCountSchema = mongoose.Schema({
  count: Number,
  RecentVist: [{ date: Date, record: {} }],
});

const vistorCount = mongoose.model("vistorCount", vistorCountSchema);

export default vistorCount;
