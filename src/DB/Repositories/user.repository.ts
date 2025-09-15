import { IUser } from "../../Common";
import { BaseRepository } from "./base.repository";
import { userModel } from "../Models";
import { Model } from "mongoose";



export class UserRepository extends BaseRepository<IUser>{
    constructor(protected _usermodel: Model<IUser>){
        super(_usermodel)
    }
}