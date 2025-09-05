import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //The one who follow
    required: true,
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //The one who is getting followed
    required: true,
  },
});

const Follow = mongoose.model("Follow", followSchema);

export default Follow;
