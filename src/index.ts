import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import * as controllers from "./Modules/controllers.index";
import { dbConnection } from "./DB/db.connection";
import s3Client from "./Utils/Services/s3-client.utils";
import { Server, Socket } from "socket.io";
import cors from 'cors'
import { ioInitialization } from "./Gateways/socketIo.gateways";


const app = express();

app.use(cors());
app.use(express.json());

dbConnection();

app.use("/api/auth", controllers.authController);
app.use("/api/users", controllers.profileController);
app.use("/api/posts", controllers.postController);
app.use("/api/comments", controllers.commentController);
app.use("/api/reacts", controllers.reactController);
app.use("/api/profile", controllers.profileController);

app.get("/api/upload", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.query.key as string;
    if (!key) return res.status(400).json({ message: "Missing key query param" });

    const url = await s3Client.getSignedUrl(key);
    res.json({ url });
  } catch (err) {
    next(err);
  }
});

app.use((err: Error | null, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const status = 500;
  const message = "Something went wrong";
  res.status(status).json({ message: err?.message || message });
});

const port: number | string = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// const io = new Server(server, {cors:{origin:'*'}})

// io.on('connection', (socket:Socket)=>{
//   console.log('a user connected');
//   console.log(socket.id)
// })

ioInitialization(server)
