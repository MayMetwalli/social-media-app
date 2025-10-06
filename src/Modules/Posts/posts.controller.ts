import { Router, Request, Response } from "express";
import postService from "./Services/post.service"; 
import { authentication } from "../../Middleware"; 

const router = Router();

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


export default router;
