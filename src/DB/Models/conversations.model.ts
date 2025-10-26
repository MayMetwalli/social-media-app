import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  type: "direct" | "group";
  members: string[];
  name?:string;
  createdAt: Date;
  updatedAt: Date;
    _id: string;
}

const conversationSchema = new Schema<IConversation>(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
      default: "direct",
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const ConversationModel = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);
