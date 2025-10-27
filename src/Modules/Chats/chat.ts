import { Socket } from "socket.io";
import { ChatEvents } from "./chat.events";


export const chatInitialization = (socket: Socket) => {
  const chatEvents = new ChatEvents(socket)

  chatEvents.sendPrivateMessageEvent()
  chatEvents.getConversationMessagesEvent()
  chatEvents.getGroupHistoryEvent()
  chatEvents.sendGroupMessageEvent()
  chatEvents.onlineStatusEvents()
  chatEvents.typingEvents()
};
