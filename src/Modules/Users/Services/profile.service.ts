import { ConversationRepository } from './../../../DB/Repositories/conversation.repository';
import { BadRequestException } from "../../../Utils/Errors/exceptions.utils";
import { Request, Response } from "express";
import s3Client from "../../../Utils/Services/s3.service";
import { IRequest } from "../../../Common";
import { Socket } from 'socket.io';
import { UserRepository } from '../../../DB/Repositories';
import { userModel } from '../../../DB/Models';
const conversationRepository = new ConversationRepository();



export class ProfileService {
  private s3Client = s3Client;
  private userRepo = new UserRepository(userModel)

  async uploadProfilePicture(req: Request, res: Response) {
    const { file } = req;
    if (!file) throw new BadRequestException("Please upload a file");

    const key = await this.s3Client.uploadProfilePic(file, "profiles/");

    return res.json({
      message: "Profile picture uploaded successfully",
      key,
    });
  }

  async getProfilePicStream(key: string): Promise<NodeJS.ReadableStream> {
    return await this.s3Client.getObjectStream(key);
  }

  async deleteProfilePicture(key: string): Promise<void> {
    return await this.s3Client.deleteObject(key);
  }


createGroup = async (req: Request, res: Response) => {
    try {
      const { user: { _id } } = (req as IRequest).loggedInUser;
      const { name, memberIds } = req.body;

      if (!name || !memberIds || !Array.isArray(memberIds))
        throw new BadRequestException("Group name and members are required");

      const members = await this.userRepo.findDocuments({ _id: { $in: memberIds } });
      if (members.length !== memberIds.length) throw new BadRequestException("Some members not found");

      const group = await conversationRepository.createNewDocument({
        type: "group",
        name,
        members: [_id, ...memberIds],
      });

      res.status(201).json({
        success: true,
        message: "Group created successfully",
        data: group,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
}




export default new ProfileService();
