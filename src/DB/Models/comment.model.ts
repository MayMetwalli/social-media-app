import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  postId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
  isFrozen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
    isFrozen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const commentModel = mongoose.model<IComment>("Comment", commentSchema);
