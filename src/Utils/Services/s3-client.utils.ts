import {S3Client, PutObjectCommand,GetObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import fs from "fs";

export class S3ClientService {
  private s3Client: S3Client;

  private bucketName = process.env.AWS_BUCKET_NAME as string;
  private keyFolder = process.env.AWS_KEY_FOLDER || "";
    static uploadBufferOrStream: any;
    static getSignedUrl: any;
    static uploadFromPath: any;
    static deleteObject: any;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION as string,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
      }
    });
  }
  async uploadBufferOrStream(
    key: string,
    body: Buffer | Uint8Array | Blob | string | Readable,
    mimeType?: string
  ) {
    const fullKey = `${this.keyFolder}/${key}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fullKey,
      Body: body,
      ContentType: mimeType
    });
    return this.s3Client.send(command);
  }


  async uploadFromPath(filePath: string, key: string, mimeType?: string) {
    const fileStream = fs.createReadStream(filePath);
    return this.uploadBufferOrStream(key, fileStream, mimeType);
  }


  async getSignedUrl(key: string, expiresIn = 3600) {
    const fullKey = `${this.keyFolder}/${key}`;
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fullKey
    });
    return getSignedUrl(this.s3Client, command, { expiresIn });
  }


  async deleteObject(key: string) {
    const fullKey = `${this.keyFolder}/${key}`;
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fullKey
    });
    return this.s3Client.send(command);
  }
}
