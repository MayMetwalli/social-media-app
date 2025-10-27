import { Socket } from "socket.io";
import { ChatService } from "./Services/chat.service";

export class ChatEvents {
  private chatService: ChatService = new ChatService();

  constructor(private socket: Socket) {}

  sendPrivateMessageEvent() {
    this.socket.on("send private message", (data) => {
      this.chatService.sendPrivateMessage(this.socket, data);
    });
  }

  getConversationMessagesEvent() {
    this.socket.on("get-chat-history", (data) => {
      this.chatService.getConversationMessages(this.socket, data);
    });
  }

  sendGroupMessageEvent() {
    this.socket.on("send-group-message", (data) => {
      this.chatService.sendGroupMessage(this.socket, data);
    });
  }

  getGroupHistoryEvent() {
    this.socket.on("get-group-chat", (data) => {
      this.chatService.getGroupHistory(this.socket, data);
    });
  }

  onlineStatusEvents() {
    this.socket.on("user-online", () => {
      this.chatService.setUserOnline(this.socket);
    });

    this.socket.on("disconnect", () => {
      this.chatService.setUserOffline(this.socket);
    });
  }

  typingEvents() {
    this.socket.on("typing", (data) => {
      this.chatService.handleTyping(this.socket, data);
    });
  }
}
