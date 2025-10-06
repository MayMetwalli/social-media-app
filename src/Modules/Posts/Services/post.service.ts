import { postModel } from "../../../DB/Models/post.model"; 
import { userModel } from "../../../DB/Models"; 
import emailService from "../../../Utils/Services/email.service"; 

class PostService {
  async likePost(userId: string, postId: string) {
    const post = await postModel.findById(postId);
    if (!post) throw new Error("Post not found");

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();

      const owner = await userModel.findById(post.userId);
      if (owner) {
        try {
          await emailService.sendEmail({
            to: owner.email,
            subject: "Someone liked your post",
            html: `<p>User <strong>${userId}</strong> liked your post.</p>`,
          });
        } catch (err) {
          console.warn("Failed to send like notification:", err);
        }
      }
    }

    return { message: "Post liked", likes: post.likes.length };
  }

  async unlikePost(userId: string, postId: string) {
    const post = await postModel.findById(postId);
    if (!post) throw new Error("Post not found");

    post.likes = post.likes.filter((id) => id !== userId);
    await post.save();
    return { message: "Post unliked", likes: post.likes.length };
  }
}

export default new PostService();
