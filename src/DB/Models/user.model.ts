import mongoose from 'mongoose';
import { GenderEnum, ProviderEnum, RoleEnum, IUser, OtpTypesEnum } from '../../Common';




const userSchema = new mongoose.Schema<IUser>({
    firstName:{
        type: String,
        required: true,
        minLength:[4, 'First name must be at least 4 characters long']
    },
    lastName:{
        type: String,
        required: true,
        minLength:[4, 'Last name must be at least 4 characters long']

    },
    email:{
        type: String,
        required: true,
        index:{
            unique: true,
            name: 'idx_email_unique'
        }
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    password:{
        type: String,
        required: true,
    },
    age: Number,
    role:{
        type: String,
        enum:RoleEnum,
        default: RoleEnum.USER
    },
    gender:{
        type: String,
        enum:GenderEnum,
        default: GenderEnum.MALE
    },
    DOB: Date,
    profilePicture: String,
    coverPicture: String,
    provider:{
        type: String,
        enum:ProviderEnum,
        default:ProviderEnum.LOCAL,
    },
    is2FAEnabled: { type: Boolean, default: false },
    googleId: String,
    phoneNumber: String,
    OTPS:[{
        value:{type: String, required:true},
        expiresAt:{type:Date, default:Date.now() + 6000000},
        otpType:{type:String, enum:OtpTypesEnum, required: true}
    }]
})


const userModel = mongoose.model<IUser>('user',userSchema)
export {userModel}