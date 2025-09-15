import crypto from 'node:crypto'


const IV_LENGTH = parseInt(process.env.IV_LENGTH as string)
const ENCRYPTION_SECRET_KEY = Buffer.from(process.env.ENCRYPTION_SECRET_KEY as string)


export const encrypt = (text:string) : string=>{
    const iv:Buffer = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, iv)
    let encryptedData = cipher.update(text, 'utf-8', 'hex')
    encryptedData += cipher.final('hex')
    return `${iv.toString('hex')}:${encryptedData}`
}

export const decrypt = (encryptedData:string): string=>{
    const [ivHex, encryptedText] = encryptedData.split(':')
      if (!ivHex || !encryptedText) {
    throw new Error('Invalid encrypted data format')
  }
    const binaryLikeIv:Buffer = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, binaryLikeIv)

    let decryptedData: string = decipher.update(encryptedText as string, 'hex','utf8')
        decryptedData += decipher.final('utf-8')
        return decryptedData
    
}

 
