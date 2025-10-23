import { PostRepository } from "../../../DB/Repositories/post.repository"; 
import { IPost, postModel } from "../../../DB/Models/post.model"; 
import { userModel } from "../../../DB/Models";
import emailService from "../../../Utils/Services/email.service";
import { commentModel } from "../../../DB/Models/comment.model";

export class PostService {
  private readonly postRepository = new PostRepository();

  async createPost(data: Partial<IPost>): Promise<IPost> {
    return await this.postRepository.createNewDocument(data);
  }

  async getPostById(id: string): Promise<IPost | null> {
    return await this.postRepository.findDocumentById(id);
  }

  async updatePost(id: string, data: Partial<IPost>): Promise<IPost | null> {
    const post = await this.postRepository.findDocumentById(id);
    if (!post) return null;

    Object.assign(post, data);
    await post.save();
    return post;
  }

  async freezePost(id: string): Promise<IPost | null> {
    const post = await this.getPostById(id);
    if (!post) return null;

    post.isFrozen = true;
    await post.save();
    return post;
  }

  async unfreezePost(id: string): Promise<IPost | null> {
    const post = await this.getPostById(id);
    if (!post) return null;

    post.isFrozen = false;
    await post.save();
    return post;
  }

async deletePost(id: string): Promise<{ message: string }> {
    const post = await postModel.findById(id);
    if (!post) throw new Error("Post not found");

    await commentModel.deleteMany({ postId: id });

    await postModel.findByIdAndDelete(id);

    return { message: "Post and related comments deleted" };
  }
  async findById(id: string): Promise<IPost | null> {
    return await postModel.findById(id);
  }

  async findByIdAndDelete(id: string): Promise<IPost | null> {
    return await postModel.findByIdAndDelete(id);
  }


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
