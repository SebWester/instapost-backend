import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema ({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const Like = mongoose.model('Like', LikeSchema);

export default Like; 