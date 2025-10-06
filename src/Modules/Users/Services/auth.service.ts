import {Request, Response, NextFunction } from "express";
import { IRequest, IUser, OtpTypesEnum, SignUpBodyType } from "../../../Common";
import { UserRepository } from "../../../DB/Repositories/user.repository";
import { BlackListedTokenModel, userModel } from "../../../DB/Models";
import { compareHash, encrypt, generateHash, localEmitter } from "../../../Utils";
import {SignOptions} from "jsonwebtoken"
import * as uuid from 'uuid'
import { generateToken } from "../../../Utils/Encryption/token.utils";
import { randomUUID } from "crypto";
import { BlackListedTokenRepository } from "../../../DB/Repositories";



class AuthService{
    resetPassword(email: any, newPassword: any) {
        throw new Error("Method not implemented.");
    }

private userRepo : UserRepository = new UserRepository(userModel)
private blackLsitedRepo: BlackListedTokenRepository = new BlackListedTokenRepository(BlackListedTokenModel)

    signUp = async (req:Request, res:Response, next:NextFunction)=>{
        // const {firstName, lastName, email, password, gender, phoneNumber, DOB}:Partial<IUser> = req.body

        const {firstName, lastName, email, password, gender, phoneNumber, DOB}: SignUpBodyType = req.body

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

    confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
        const { email, otp } = req.body;


        const user = await this.userRepo.findOneDocument({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const confirmationOtp = user.OTPS?.find(o => o.otpType === OtpTypesEnum.CONFIRMATION);
        if (!confirmationOtp) {
            return res.status(400).json({ message: 'No confirmation OTP found' });
        }

        if (Date.now() > confirmationOtp.expiresAt) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const isOtpValid = compareHash(otp, confirmationOtp.value); 
        if (!isOtpValid) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.isVerified = true;
        user.OTPS = user.OTPS?.filter(o => o.otpType !== OtpTypesEnum.CONFIRMATION);

        await user.save();

        return res.status(200).json({ message: 'Email confirmed successfully', data: { user } });
    };


    SignIn = async (req: Request, res: Response)=>{
        const {email, password} = req.body

        const user:IUser|null = await this.userRepo.findOneDocument({email})
        if(!user) return res.status(401).json({message: 'Email/password incorrect'})

            const isPasswordMatched = compareHash(password, user.password)
            if(!isPasswordMatched) return res.status(401).json({message: 'Email/password incorrect'})

                const accessToken = generateToken(
                    {
                        _id: user._id,
                        email: user.email,
                        provider: user.provider,
                        role: user.role
                    },
                    process.env.JWT_ACCESS_SECRET as string,
                    {
                        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
                        jwtid: randomUUID()
                    }
                )
                const refreshToken = generateToken(
                    {
                        _id:user._id,
                        email:user.email,
                        provider: user.provider,
                        role: user.role
                    },
                    process.env.JWT_REFRESH_SECRET as string,
                    {
                        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
                        jwtid: uuid.v4()
                    }
                )
    }


    logout = async (req: Request, res:Response)=>{
        const {token: {jti, exp}} = (req as unknown as IRequest).loggedInUser
        const expiresAt = exp ? new Date(exp * 1000) : new Date()
        const blackListedToken = await this.blackLsitedRepo.createNewDocument({tokenId: jti, expiresAt })
         res.status(200).json({message: 'user logged out successfully', data:{blackListedToken}})
    }

        profileImage = async (req: Request, res: Response, next: NextFunction) => {

        return res.status(200).json({ message: 'Profile Image uploaded successfully', file: req.file });
    };
}




export default new AuthService()