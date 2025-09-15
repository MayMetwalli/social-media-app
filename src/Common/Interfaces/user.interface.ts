import { GenderEnum, OtpTypesEnum, ProviderEnum, RoleEnum } from "../Enums/user.enum";
import { Document } from "mongoose";

interface IOTP {
    value: string;
    expiresAt: number;
    otpType:OtpTypesEnum;
}


interface IUser extends Document{
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    age?:number;
    role:RoleEnum;
    gender: GenderEnum;
    DOB?: Date;
    profilePicture?: string;
    coverPicture?: string;
    provider: ProviderEnum;
    googleId?: string;
    phoneNumber?: string;
    isVerified?:boolean;
    OTPS?:IOTP[]
}


interface IEmailArgument {
    to:string;
    cc?:string;
    subject:string;
    content:string;
    attachments?:[]
}




export type {IUser, IEmailArgument}