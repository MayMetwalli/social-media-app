import { CommentRepository } from "../../../DB/Repositories/comment.repository"; 
import { commentModel, IComment } from "../../../DB/Models/comment.model";
import mongoose from "mongoose";
import { replyModel } from "../../../DB/Models/reply.model";

export class CommentService {
  private commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async createComment(data: Partial<IComment>): Promise<IComment> {
    return await this.commentRepository.createComment(data);
  }

  async getCommentById(id: string): Promise<IComment | null> {
    return await this.commentRepository.findCommentById(id);
  }

  async updateComment(id: string, data: Partial<IComment>): Promise<IComment | null> {
    return await this.commentRepository.updateComment(id, data);
  }

  async freezeComment(id: string): Promise<IComment | null> {
    return await this.commentRepository.freezeComment(id);
  }

async hardDeleteComment(id: string) {
  const comment = await commentModel.findById(id);
  if (!comment) throw new Error("Comment not found");

  await replyModel.deleteMany({ commentId: id });
  await commentModel.findByIdAndDelete(id);
  return { message: "Comment and its replies deleted" };
}



  async getCommentWithReply(id: string): Promise<IComment | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid comment ID");
      }

  
      const comment = await commentModel.findById(id).lean();
      if (!comment) return null;

      const replies = await commentModel.find({ parentCommentId: id }).lean();

      return {
        ...comment,
        replies, 
      } as unknown as IComment; 
    } catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

export const commentService = new CommentService();
