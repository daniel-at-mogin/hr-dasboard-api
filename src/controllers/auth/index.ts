import AuthService from "@/services/auth.service";
import { Request, Response } from "express"

type AuthRequest = Request<{}, any, {
  email: string;
  password: string;
}>
type AuthResponse<TData> = Response<ResBody<TData>>

class AuthController {
  static POST = async (req: AuthRequest, res: AuthResponse<any>) => {
    const { data, error } = await AuthService.POST(req.body)

    if (error) {
      return res.status(Number(error.code)).json({
        status: Number(error.code),
        success: false,
        message: error.message
      })
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: `Sign in successfull`,
      data: data
    })
  }

  static DELETE = async (req: AuthRequest, res: AuthResponse<undefined>) => {
    const { error } = await AuthService.DELETE()

    if (error) {
      return res.status(Number(error.code)).json({
        status: Number(error.code),
        success: true,
        message: error.message
      })
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: `Sign out successfull`
    })
  }
}

export default AuthController