import { JwtPayload } from 'jsonwebtoken';
import { GenderEnum, OtpTypesEnum, ProviderEnum, RoleEnum } from "../Enums/user.enum";
import { Document } from "mongoose";
import { Request } from 'express';

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
    OTPS?:IOTP[];
    is2FAEnabled?: boolean;
    isBlocked?: boolean;
    friends?: string[];
}


interface IEmailArgument {
    to:string;
    cc?:string;
    subject:string;
    content:string;
    attachments?:[]
}


interface IRequest extends Request{
    loggedInUser:{ user:IUser, token: JwtPayload}
}

interface IBlackListedToken extends Document {
    tokenId: string, 
    expiresAt: Date,
}


export type {IUser, IEmailArgument, IRequest, IBlackListedToken}