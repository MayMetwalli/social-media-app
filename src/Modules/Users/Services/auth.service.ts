import {Request, Response, NextFunction } from "express";
import { IUser, OtpTypesEnum } from "../../../Common";
import { UserRepository } from "../../../DB/Repositories/user.repository";
import { userModel } from "../../../DB/Models";
import { encrypt, generateHash, localEmitter } from "../../../Utils";





class AuthService{

private userRepo : UserRepository = new UserRepository(userModel)


    signUp = async (req:Request, res:Response, next:NextFunction)=>{
        const {firstName, lastName, email, password, gender, phoneNumber, DOB}:Partial<IUser> = req.body

        const isEmailExists = await this.userRepo.findOneDocument({email}, 'email')
        if(isEmailExists) return res.status(409).json({message:'Email already exists', data:{invalidEmail: email}})


        const encryptedPhoneNumber = encrypt(phoneNumber as string)

        const hashedPassword= generateHash(password as string)

        const otp = Math.floor(Math.random()* 1000000).toString()
        localEmitter.emit('sendEmail',{
            to:email,
            subject:'OTP for Sign Up',
            content:`Your OTP is ${otp}`
        })

        const confirmationOtp = {
            value: generateHash(otp),
            expiresAt: Date.now()+ 6000000,
            otpType: OtpTypesEnum.CONFIRMATION
        }


        const newUser = await this.userRepo.createNewDocument({firstName, lastName, email, password:hashedPassword, gender, phoneNumber:encryptedPhoneNumber, DOB, OTPS:[confirmationOtp]})    
        return res.status(201).json({message:'User created successfully', data:{newUser}})
    }

}


export default new AuthService()