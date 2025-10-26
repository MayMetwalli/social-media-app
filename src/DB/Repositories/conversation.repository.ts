import { ConversationModel, IConversation } from './../Models/conversations.model';

export class ConversationRepository {
  async findOneDocument(filter: any): Promise<IConversation | null> {
    return await ConversationModel.findOne(filter);
  }

  async createNewDocument(data: Partial<IConversation>): Promise<IConversation> {
    const conversation = new ConversationModel(data);
    return await conversation.save();
  }

  async findById(id: string): Promise<IConversation | null> {
    return await ConversationModel.findById(id);
  }
}
