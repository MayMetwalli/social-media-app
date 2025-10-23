import { BaseRepository } from "./base.repository"; 
import { postModel, IPost } from "../Models/post.model";

export class PostRepository extends BaseRepository<IPost> {
  constructor() {
    super(postModel);
  }
}
