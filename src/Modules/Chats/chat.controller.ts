import { Router, Request, Response } from "express";
import { authentication } from "../../Middleware";
import { ChatService } from "./Services/chat.service";
import { z } from "zod";

const router = Router();
const chatService = new ChatService();

const messageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty"),
  targetUserId: z.string().optional(),
  targetGroupId: z.string().optional(),
});

router.get("/private/:conversationId", authentication, async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return res.status(400).json({ error: "conversationId is required" });
    }

    const socketLike = { emit: () => {} } as any;
    await chatService.getConversationMessages(socketLike, conversationId);

    res.json({ message: "Conversation messages retrieved successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/group/:groupId", authentication, async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    if (!groupId) {
      return res.status(400).json({ error: "groupId is required" });
    }

    const socketLike = { emit: () => {} } as any;
    await chatService.getGroupHistory(socketLike, groupId);

    res.json({ message: "Group chat history retrieved successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/private", authentication, async (req: Request, res: Response) => {
  try {
    const validation = messageSchema.safeParse(req.body);
    if (!validation.success) {
      const firstError = validation.error?.issues?.[0]?.message || "Invalid request data";
      return res.status(400).json({ error: firstError });
    }

    const { text, targetUserId } = validation.data;
    if (!targetUserId) {
      return res.status(400).json({ error: "Target user is required" });
    }

    const socketLike = { data: { userId: (req as any).userId } } as any;
    await chatService.sendPrivateMessage(socketLike, { text, targetUserId });

    res.status(201).json({ message: "Private message sent successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/group", authentication, async (req: Request, res: Response) => {
  try {
    const validation = messageSchema.safeParse(req.body);
    if (!validation.success) {
      const firstError = validation.error?.issues?.[0]?.message || "Invalid request data";
      return res.status(400).json({ error: firstError });
    }

    const { text, targetGroupId } = validation.data;
    if (!targetGroupId) {
      return res.status(400).json({ error: "Group ID is required" });
    }

    const socketLike = { data: { userId: (req as any).userId } } as any;
    await chatService.sendGroupMessage(socketLike, { text, targetGroupId });

    res.status(201).json({ message: "Group message sent successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
