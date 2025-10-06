import { BadRequestException } from "../../../Utils/Errors/exceptions.utils";
import { Request, Response } from "express";
import s3Client from "../../../Utils/Services/s3.service";

export class ProfileService {
  private s3Client = s3Client;

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
}

export default new ProfileService();
