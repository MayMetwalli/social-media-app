import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  userId: string;
  content: string;
  image?: string;
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
  isFrozen: boolean;
}

const postSchema = new Schema<IPost>(
  {
    userId: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    likes: { type: [String], default: [] },
     isFrozen: { type: Boolean, default: false },
  },
  { timestamps: true }
);



export const postModel = mongoose.model<IPost>("Post", postSchema);
