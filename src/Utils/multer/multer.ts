import multer, { FileFilterCallback, Multer } from "multer";
import os from "node:os";
import { Request } from "express";
import {v4 as uuid} from "uuid";
import { BadRequestException } from "../Errors/exceptions.utils";

export enum StorageEnum {
    MEMORY = "MEMORY",
    DISK = "DISK"
}

export const fileValidation = {
    images: ["image/jpeg","image/jpg", "image/png"],
    pdf: ["application/pdf"],
};







export const cloudFileUpload = ({
    validation =[],
    storageApproach = StorageEnum.MEMORY, maxsize = 2}:{validation?:string[]; storageApproach?:StorageEnum; maxsize?:number}={}):Multer=>{
    console.log(os.tmpdir());
    const storage = storageApproach === StorageEnum.MEMORY ? multer.memoryStorage() : multer.diskStorage({
        destination: os.tmpdir(),
        filename: (req:Request, file:Express.Multer.File , cb)=>{
            cb(null, `${uuid()}-${file.originalname}`)
        },
    })


    function fileFilter(req:Request, file:Express.Multer.File, cb: FileFilterCallback)
    {
        if(!validation.includes(file.mimetype)) {
            return cb(new BadRequestException("Invalid File Type"))
    }
    return cb(null, true)
}

    return multer ({
        fileFilter,
        limits: {fileSize:maxsize * 1024 *1024},
        storage
    })
}




// const storage = multer.memoryStorage();
// export const uploadSingle = multer({ storage }).single("file");
