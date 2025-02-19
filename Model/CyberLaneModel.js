import mongoose from "mongoose";

const CyberLaneVistCountShema = mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
  RecentVist: {
    type: [{ date: Date, record: {} }],
    default: [],
  },
});

const CyberLaneVistCount = mongoose.model(
  "Cyberlanevist",
  CyberLaneVistCountShema
);

export default CyberLaneVistCount;
