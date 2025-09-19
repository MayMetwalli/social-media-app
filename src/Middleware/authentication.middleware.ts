import {Response, Request, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../Utils/Encryption/token.utils";
import { IRequest, IUser } from "../Common";
import { UserRepository } from "../DB/Repositories/user.repository";
import { userModel } from "../DB/Models";
import { BlackListedTokenRepository } from "../DB/Repositories/black-listed-tokens.repository";
import { BlackListedTokenModel } from "../DB/Models/black-listed-tokens.model";


const userRepo = new UserRepository(userModel)
const blackListedRepo = new BlackListedTokenRepository(BlackListedTokenModel)


export const authentication = async (req: Request, res: Response, next:NextFunction)=>{
    const {authorization: accessToken} = req.headers
     const customReq = req as IRequest;
    if(!accessToken) return res.status(401).json({message: 'Please login first'})

        const [prefix, token] = accessToken.split(' ')
        if(prefix !== process.env.JWT_PREFIX || !token) return res.status(401).json({message: 'invalid token'})

        const decodedData = verifyToken(token, process.env.JWT_ACCESS_SECRET as string)
        if(!decodedData._id) return res.status(401).json({message: 'invalid payload'})

            const blackListedToken = await blackListedRepo.findOneDocument({tokenId:decodedData.jti})
            if (blackListedToken) return res.status(401).json({message:'Your session is expired'})


            const user:IUser |null = await userRepo.findDocumentById(decodedData._id, '-password')
            if (!user) return res.status(404).json({message:'Please register first'})



           customReq.loggedInUser = { user, token: decodedData as JwtPayload };        
           next()
}