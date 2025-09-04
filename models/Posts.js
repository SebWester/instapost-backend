import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    
    username: {
      type: String,
      required: true,
    },
    
     profileImageUrl: {
    type: String,
    default: "", 
  },

    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    
    
    likes: {
      type: Number,
      default: 0,
    },
    
    
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;

