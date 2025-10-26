import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  text: string;
  senderId: string | Types.ObjectId;
  conversationId: string | Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
    _id: string;
}

const messageSchema = new Schema<IMessage>(
  {
    text: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model<IMessage>("Message", messageSchema);
