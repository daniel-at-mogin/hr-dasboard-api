import ProjectService from "@/services/project.service";
import { Request, Response } from "express";

type ProjectRequest = Request<{ projectId: string; }, any, Project>
type ProjectResponse<TData> = Response<ResBody<TData>>
class ProjectController {
  static GET = async (req: ProjectRequest, res: ProjectResponse<Project[]>) => {
    const { status, data, error } = await ProjectService.GET()
    const statusCode = Number(status)

    if (error) {
      return res.status(statusCode).json({
        status: statusCode,
        success: false,
        message: error.message
      })
    }

    return res.status(statusCode).json({
      status: statusCode,
      success: true,
      data
    })
  }

  static POST = async (req: ProjectRequest, res: ProjectResponse<Project>) => {
    const { status, data, error } = await ProjectService.POST({
      name: req.body.name
    })
    const statusCode = Number(status)

    if (error) {
      return res.status(statusCode).json({
        status: statusCode,
        success: false,
        message: error.message
      })
    }

    return res.status(statusCode).json({
      status: statusCode,
      success: true,
      message: `Project has been created successfully`,
      data: data.at(0)
    })
  }

  static PUT = async (req: ProjectRequest, res: ProjectResponse<Project>) => {
    const projectId = req.body.id
    if (!projectId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `No project ID specified`
      })
    }

    const { status, data, error } = await ProjectService.PUT(projectId, {
      name: req.body.name
    })
    const statusCode = Number(status)

    if (error) {
      return res.status(statusCode).json({
        status: statusCode,
        success: false,
        message: error.message
      })
    }

    return res.status(statusCode).json({
      status: statusCode,
      success: true,
      message: `Project has been updated successfully`,
      data: data.at(0)
    })
  }

  static DELETE = async (req: ProjectRequest, res: ProjectResponse<Project>) => {
    const projectId = req.params.projectId
    if (!projectId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: `No team ID specified`
      })
    }

    const { status, data, error } = await ProjectService.DELETE(projectId)
    const statusCode = Number(status)

    if (error) {
      return res.status(statusCode).json({
        status: statusCode,
        success: false,
        message: error.message
      })
    }

    return res.status(statusCode).json({
      status: statusCode,
      success: true,
      message: `Project has been deleted successfully`,
      data: data.at(0)
    })
  }
}

export default ProjectController