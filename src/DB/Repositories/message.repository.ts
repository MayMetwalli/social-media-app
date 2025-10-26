import { IMessage, MessageModel } from "../Models/messages.model"; 
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";

export class MessageRepository extends BaseRepository<IMessage> {
  constructor() {
    super(MessageModel as Model<IMessage>);
  }

  async findMessagesByConversation(conversationId: string): Promise<IMessage[]> {
    return await MessageModel.find({ conversationId }).sort({ createdAt: 1 });
  }
}
