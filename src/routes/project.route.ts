import ProjectController from '@/controllers/projects'
import validateRequest from '@/validation'
import { CreateProjectSchema, UpdateProjectSchema } from '@/validation/schemas/project.schema'
import express from 'express'
const route = express.Router()

route.get('/', ProjectController.GET)
route.post('/', validateRequest(CreateProjectSchema), ProjectController.POST)
route.put('/', validateRequest(UpdateProjectSchema), ProjectController.PUT)
route.delete('/:projectId', ProjectController.DELETE)

export default route