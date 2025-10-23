import bcrypt from "bcrypt";
import { userModel } from "../../../DB/Models";
import s3Service from "../../../Utils/Services/s3-client.utils"; 
import { Request, Response } from "express";
import { postModel as Post } from "../../../DB/Models/post.model";
import { commentModel as Comment } from "../../../DB/Models/comment.model";
import { replyModel as Reply } from "../../../DB/Models/reply.model";
import { friendRequestModel } from "../../../DB/Models/friendRequest.model";


class UserService {

  async updateBasicInfo(userId: string, data: { name?: string; bio?: string }) {
    const user = await userModel.findByIdAndUpdate(userId, data, { new: true });
    if (!user) throw new Error("User not found");
    return user;
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) throw new Error("Invalid password");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return { message: "Password updated" };
  }

  async updateEmail(userId: string, newEmail: string) {
    const existing = await userModel.findOne({ email: newEmail });
if (existing && (existing._id as string).toString() !== userId)
  throw new Error("Email already in use");

    const user = await userModel.findByIdAndUpdate(userId, { email: newEmail }, { new: true });
    if (!user) throw new Error("User not found");
    return user;
  }

async updateProfilePicture(userId: string, file: Express.Multer.File) {
    if (!file) throw new Error("No file uploaded");

    const key = await s3Service.uploadProfilePic(file, "profile-pictures/");
    // if (!key) throw new Error("Failed to upload file");

    const signedUrl = await s3Service.getSignedUrl(key!);

    const user = await userModel.findByIdAndUpdate(
      userId,
      { profilePicture: signedUrl },
      { new: true }
    );

    if (!user) throw new Error("User not found");

    return user; 
  }



  async getProfile(userId: string) {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    let profilePictureUrl: string | undefined = undefined;
    if (user.profilePicture) {
      profilePictureUrl = await s3Service.getSignedUrl(user.profilePicture);
    }

    return { user, profilePictureUrl };
  }


  async deleteUser(userId: string) {
  await Post.deleteMany({ userId });

  await Comment.deleteMany({ userId });

  await Reply.deleteMany({ userId });

  await userModel.findByIdAndDelete(userId);

  return { message: "User and all related data deleted" };
}

  async blockUser(userId: string) {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    user.isBlocked = true;
    await user.save();

    return { message: `User ${user.firstName} has been blocked.` };
  }

    async unblockUser(userId: string) {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    user.isBlocked = false;
    await user.save();

    return { message: `User ${user.firstName} has been unblocked.` };
  }

  async deleteFriendRequest(requestId: string) {
  const result = await friendRequestModel.findByIdAndDelete(requestId);
  if (!result) throw new Error("Friend request not found");
  return result;
}

async unFriend(userId: string, friendId: string) {
  const user = await userModel.findById(userId);
  const friend = await userModel.findById(friendId);

  if (!user || !friend) throw new Error("User or friend not found");

user.friends = (user.friends || []).filter((id: any) => id.toString() !== friendId);
friend.friends = (friend.friends || []).filter((id: any) => id.toString() !== userId);

  await user.save();
  await friend.save();

  return { message: "Unfriended successfully" };
}

}

export default new UserService();
