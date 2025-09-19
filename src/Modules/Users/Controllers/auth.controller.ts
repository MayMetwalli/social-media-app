import {Router} from "express";
import AuthService from "../Services/auth.service";
import { authentication } from "../../../Middleware";
import { validationMiddleware } from "../../../Middleware/validation.middleware";
import { SignUpValidator } from "../../../Validators";

const authController = Router()

authController.post('/signup', validationMiddleware(SignUpValidator) ,AuthService.signUp)

authController.put('/confirmEmail', AuthService.confirmEmail)

authController.post('/signIn', AuthService.SignIn)

authController.post('/logout', authentication, AuthService.logout)

export {authController}