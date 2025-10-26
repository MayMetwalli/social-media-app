import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "../Utils/Encryption/token.utils";
import { chatInitialization } from "../Modules/Chats/chat";


export const connectedSockets = new Map<string, string[]>()
let io:Server | null = null


function socketAuthentication(socket: Socket, next: Function){
    const token = socket.handshake.auth.authorization
    
            const decodedData = verifyToken(token, process.env.JWT_ACCESS_SECRET as string)
            const userId = decodedData._id;
            socket.data = {userId: decodedData._id}
                        const userTabs = connectedSockets.get(socket.data.userId)
  if (!userTabs) {
    connectedSockets.set(userId, [socket.id]);
    socket.broadcast.emit("user-online", { userId });
  } else {
    userTabs.push(socket.id);
  }

  socket.emit("connected", {
    user: {
      _id: userId,
      firstName: decodedData.data.firstName,
      lastName: decodedData.data.lastName,
    },
  });

  next();
}

function socketDisconnection(socket:Socket){
    socket.on('disconnect',()=>{
        const userId = socket.data.userId
        let userTabs = connectedSockets.get(userId)
        if(userTabs && userTabs.length){
            userTabs = userTabs.filter((tab)=> tab !== socket.id)
            if (!userTabs.length) {
        connectedSockets.delete(userId);
        socket.broadcast.emit("user-offline", { userId });
      } else {
        connectedSockets.set(userId, userTabs);
      }
        }
    })
}




export const ioInitialization = (server:HttpServer)=>{
     io = new Server(server, {cors: {origin: '*'}})

    io.use(socketAuthentication)

    io.on('connection', (socket:Socket)=>{
        // console.log('a user connected');
        // console.log(socket.id)
        chatInitialization(socket)
        socketDisconnection(socket)
    })
}


export const getIo = (): Server | null => io;

