import mongoose from "mongoose";

const CyberLaneVistCountShema = mongoose.Schema({
  count: Number,
  RecentVist: [{ date: Date, record: {} }],
});

const CyberLaneVistCount = mongoose.model("Cyberlanevist", CyberLaneVistCountShema);

export default CyberLaneVistCount;
