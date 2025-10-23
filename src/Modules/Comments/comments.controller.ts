import { Router, Request, Response } from "express";
import { authentication } from "../../Middleware";
import { CommentService } from "./Services/comments.service"; 

const commentService = new CommentService();
const router = Router();

router.post("/", authentication, async (req: Request, res: Response) => {
  try {
    const { userId, postId, content } = req.body;
    if (!postId || !userId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const comment = await commentService.createComment({ userId, postId, content });
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:commentId", authentication, async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;

    if (!content) return res.status(400).json({ error: "Content cannot be empty" });

    const updated = await commentService.updateComment(commentId as string, { content });
    if (!updated) return res.status(404).json({ error: "Comment not found" });

    res.json({ message: "Comment updated successfully", updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/freeze/:commentId", authentication, async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;

    const frozen = await commentService.freezeComment(commentId as string);
    if (!frozen) return res.status(404).json({ error: "Comment not found" });

    res.json({ message: "Comment frozen successfully", frozen });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete/:commentId", authentication, async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;

    const deleted = await commentService.hardDeleteComment(commentId as string);
    if (!deleted) return res.status(404).json({ error: "Comment not found" });

    res.json({ message: "Comment permanently deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:commentId/replies", authentication, async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId as string;
    const commentWithReplies = await commentService.getCommentWithReply(commentId);

    if (!commentWithReplies) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json({
      message: "Comment with replies found successfully",
      comment: commentWithReplies,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
