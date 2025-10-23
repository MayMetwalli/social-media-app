import { Router, Request, Response } from "express";
import { authentication } from "../../Middleware"; 
import { PostService } from "./Services/post.service";
const postService = new PostService();
import { IRequest } from "../../Common";
import { localEmitter } from "../../Utils";


const router = Router();

router.post("/", authentication, async (req: Request, res: Response) => {
  try {
    const { userId, postId, content } = req.body;
    if (!postId || !userId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

const post = await postService.createPost({ userId, content });
 const senderName = "Someone"; 
  localEmitter.emit("mentionUsers", { content, senderName });    
  res.status(201).json({ message: "post created successfully", post });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/like/:postId", authentication, async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId as string;
    const postId = req.params.postId as string;

    if (!postId) return res.status(400).json({ error: "Post ID missing" });
    const result = await postService.likePost(userId, postId);

    res.json({ message: "Post liked successfully", result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/unlike/:postId", authentication, async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId as string;
    const postId = req.params.postId as string;

    if (!postId) return res.status(400).json({ error: "Post ID missing" });
    const result = await postService.unlikePost(userId, postId);

    res.json({ message: "Post unliked successfully", result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:postId", authentication, async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const { content } = req.body;

    if (!content) return res.status(400).json({ error: "Content cannot be empty" });

    const updated = await postService.updatePost(postId as string, { content });
    if (!updated) return res.status(404).json({ error: "post not found" });

    res.json({ message: "post updated successfully", updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/freeze/:postId", authentication, async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    const frozen = await postService.freezePost(postId as string);
    if (!frozen) return res.status(404).json({ error: "post not found" });

    res.json({ message: "post frozen successfully", frozen });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete/:postId", authentication, async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    const deleted = await postService.deletePost(postId as string);
    res.json({ message: "post permanently deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
