import { S3ClientService } from "./s3-client.utils"

export class FileService {
  async uploadProfilePic(buffer: Buffer, userId: string) {
    const key = `profiles/${userId}.jpg`
    await S3ClientService.uploadBufferOrStream(key, buffer, "image/jpeg")
    return S3ClientService.getSignedUrl(key) 
  }

  async uploadLargeFileFromPath(filePath: string, fileName: string) {
    return S3ClientService.uploadFromPath(filePath, `uploads/${fileName}`)
  }

  async deleteUserFiles(userId: string) {
    return S3ClientService.deleteObject(`profiles/${userId}.jpg`)
  }

  async getFileUrl(fileKey: string) {
    return S3ClientService.getSignedUrl(fileKey)
  }
}

export default new FileService()
