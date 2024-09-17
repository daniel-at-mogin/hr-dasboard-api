import TeamController from '@/controllers/teams'
import validateRequest from '@/validation'
import { CreateTeamSchema, UpdateTeamSchema } from '@/validation/schemas/team.schema'
import express from 'express'
const route = express.Router()

route.get('/', TeamController.GET)
route.post('/', validateRequest(CreateTeamSchema), TeamController.POST)
route.put('/', validateRequest(UpdateTeamSchema), TeamController.PUT)
route.delete('/:teamId', TeamController.DELETE)

export default route