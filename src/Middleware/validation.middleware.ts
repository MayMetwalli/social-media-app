import { NextFunction, Request, Response } from "express"
import { ZodType } from "zod"


type RequestKeyType = keyof Request
type SchemaType = Partial<Record<RequestKeyType, ZodType>>
type ValidationErrorType ={
    key: RequestKeyType
    issues: {
        path: PropertyKey[]
        message: string
    }[]
}


export const validationMiddleware = (schema:SchemaType)=>{
    return (req: Request, res: Response, next: NextFunction)=>{
        const reqKeys: RequestKeyType[] = ['body', 'params', 'query', 'headers']

        const validationErrors: ValidationErrorType[] = []
        for(const key of reqKeys){
            if(schema[key]){
                const result = schema[key].safeParse(req[key])
                console.log('The validation result', {key, result});
                if (!result?.success) {
                    const issues = result.error.issues.map(issue =>({
                        path: issue.path,
                        message: issue.message
                    }))
                    validationErrors.push({key, issues})
        }
            }

        }

        if (validationErrors.length) return res.status(404).json({message:'validation failed'})


        next()
    }
}