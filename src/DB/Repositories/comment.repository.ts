import { commentModel, IComment } from "../Models/comment.model";
import { Types } from "mongoose";

export class CommentRepository {
  async createComment(data: Partial<IComment>): Promise<IComment> {
    return await commentModel.create(data);
  }

  async findCommentById(id: string): Promise<IComment | null> {
    return await commentModel.findById(new Types.ObjectId(id));
  }

  async updateComment(id: string, data: Partial<IComment>): Promise<IComment | null> {
    return await commentModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      data,
      { new: true }
    );
  }

  async freezeComment(id: string): Promise<IComment | null> {
    return await commentModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { isFrozen: true },
      { new: true }
    );
  }

  async hardDeleteComment(id: string): Promise<IComment | null> {
    return await commentModel.findByIdAndDelete(new Types.ObjectId(id));
  }
}
