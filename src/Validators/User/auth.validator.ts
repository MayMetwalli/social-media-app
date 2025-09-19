import z from 'zod'
import { GenderEnum } from '../../Common'


export const SignUpValidator = {
    body: z.object({
        firstName: z.string().min(3).max(10),
        lastName: z.string().min(3).max(10),
        email: z.email(),
        password: z.string().min(6).max(10),
        passwordConfirmation: z.string(),
        gender:z.enum(GenderEnum),
        DOB: z.date().optional(),
        phoneNumber: z.string().min(11).max(11),
    })
    // .refine(
    //     (data)=>{
    //         console.log(data);
    //         if(data.password !== data.passwordConfirmation) return false
    //         return
    //     },
    //     {path: ['passwordConfirmation'], message: 'Passwords do not match'}
    // )
    // .extend({
    //     userId: z.string().optional(),
    // })
}