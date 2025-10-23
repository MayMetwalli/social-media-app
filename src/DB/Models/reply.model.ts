import mongoose, { Schema, Document } from "mongoose";

export interface IReply extends Document {
  commentId: string;  
  userId: string;     
  content: string;   
  likes: string[];    
  createdAt: Date;
  updatedAt: Date;
}

const replySchema = new Schema<IReply>(
  {
    commentId: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: [String], default: [] },
  },
  { timestamps: true }
);


export const replyModel = mongoose.model<IReply>("Reply", replySchema);
