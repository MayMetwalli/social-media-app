import { MessageRepository } from './../../../DB/Repositories/message.repository';
import { Socket } from "socket.io";
import { ConversationRepository } from "../../../DB/Repositories/conversation.repository";
import { getIo } from '../../../Gateways/socketIo.gateways';

export class ChatService {
  private messageRepository = new MessageRepository();
  private conversationRepository = new ConversationRepository();

  async joinPrivateChat(socket: Socket, targetUserId: string) {
    let conversation = await this.conversationRepository.findOneDocument({
      type: 'direct',
      members: { $all: [socket.data.userId, targetUserId] },
    });

    if (!conversation) {
      conversation = await this.conversationRepository.createNewDocument({
        type: 'direct',
        members: [socket.data.userId, targetUserId],
      });
    }

    socket.join(conversation._id.toString());
    return conversation;
  }

  async sendPrivateMessage(socket: Socket, data: unknown) {
    const { text, targetUserId } = data as { text: string; targetUserId: string };
    const conversation = await this.joinPrivateChat(socket, targetUserId);

    const message = await this.messageRepository.createNewDocument({
      text,
      conversationId: conversation._id,
      senderId: socket.data.userId,
    });

    getIo()?.to(conversation._id.toString()).emit("message-sent", message);
  }

  async getConversationMessages(socket: Socket, conversationId: string) {
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      socket.emit("error", "Conversation not found");
      return;
    }

    const messages = await this.messageRepository.findMessagesByConversation(conversation._id.toString());
    socket.emit("chat-history", messages);
  }

  async joinChatGroup(socket:Socket, targetGroupId: string){
    let conversation = await this.conversationRepository.findOneDocument({
        _id:targetGroupId,
        type: 'group'
    })
    if (!conversation) {
  socket.emit("error", "Group not found");
  return;
}
socket.join(conversation._id.toString());
  }

  async sendGroupMessage(socket: Socket, data: unknown){
    const {text, targetGroupId} = data as {text: string, targetGroupId: string}

        const conversation = await this.conversationRepository.findOneDocument({
      _id: targetGroupId,
      type: 'group'
    });

    if (!conversation) {
      socket.emit("error", "Group not found");
      return;
    }

    const message = await this.messageRepository.createNewDocument({
      text,
      conversationId: conversation._id,
      senderId: socket.data.userId
    });

    getIo()?.to(conversation._id.toString()).emit("send-group-message", message);
  }

  async getGroupHistory(socket: Socket, targetGroupId: string){
    const messages = await this.messageRepository.findDocuments({
        conversationId: targetGroupId
    })
    socket.emit('chat-history', messages)
  }

}
