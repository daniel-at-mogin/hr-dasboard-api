import TeamService from "@/services/team.service"
import { Request, Response } from "express"
type TeamRequest = Request<{ teamId?: number }, any, Team>
type TeamResponse<TData> = Response<ResBody<TData>>

class TeamController {
  static GET = async (req: TeamRequest, res: TeamResponse<Team[]>) => {
    const { status, data, error } = await TeamService.GET()

    if (error) {
      const errorCode = Number(error.code)

      return res.status(errorCode).json({
        status: Number(errorCode),
        success: false,
        message: error.message
      })
    }

    const statucCode = Number(status)
    res.status(statucCode).json({
      status: statucCode,
      success: true,
      data: data
    })
  }

  static POST = async (req: TeamRequest, res: TeamResponse<Team>) => {
    const { status, data, error } = await TeamService.POST({
      name: req.body.name
    })
    const statusCode = Number(status)

    if (error) {
      return res.status(statusCode).json({
        status: Number(statusCode),
        success: false,
        message: error.message
      })
    }

    res.status(statusCode).json({
      status: statusCode,
      success: true,
      message: `Team has been created successfully`,
      data: data.at(0)
    })
  }

  static PUT = async (req: TeamRequest, res: TeamResponse<Team>) => {
    const teamId = req.body.id
    if (!teamId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `No team ID specified`
      })
    }

    const { status, data, error } = await TeamService.PUT(teamId, req.body)
    const statusCode = Number(status)

    if (error) {
      return res.status(statusCode).json({
        status: Number(statusCode),
        success: false,
        message: error.message
      })
    }

    res.status(statusCode).json({
      status: statusCode,
      success: true,
      message: `Team has been updated successfully`,
      data: data.at(0)
    })
  }

  static DELETE = async (req: TeamRequest, res: TeamResponse<Team>) => {
    const teamId = req.params.teamId
    if (!teamId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `No team ID specified`
      })
    }

    const { status, data, error } = await TeamService.DELETE(teamId)
    const statusCode = Number(status)

    if (error) {
      return res.status(statusCode).json({
        status: Number(statusCode),
        success: false,
        message: error.message
      })
    }

    res.status(statusCode).json({
      status: statusCode,
      success: true,
      message: `Team has been deleted successfully`,
      data: data.at(0)
    })
  }
}

export default TeamController