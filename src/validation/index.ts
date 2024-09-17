import { NextFunction, Request, Response } from 'express'
import * as Yup from 'yup'

const validateRequest = (schema: Yup.ObjectSchema<any>) => async (req: Request, res: Response<ResBody<Record<string, string>>>, next: NextFunction) => {
  try {
    await schema.validate(req.body, { abortEarly: false })

    return next()
  } catch (err: any) {
    if (err.name === "ValidationError") {
      const errors: Record<string, string> = {}
      err.inner.forEach((error: any) => {
        errors[error.path] = error.message;
      });

      return res.status(422).json({
        status: 422,
        success: false,
        data: errors
      });
    }
  }
}

export default validateRequest