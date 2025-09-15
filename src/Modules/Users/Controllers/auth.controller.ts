import {Router} from "express";
import AuthService from "../Services/auth.service";

const authController = Router()

authController.post('/signup', AuthService.signUp)



export {authController}