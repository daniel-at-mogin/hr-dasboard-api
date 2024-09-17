import AuthController from '@/controllers/auth'
import validateRequest from '@/validation'
import { LoginSchema } from '@/validation/schemas/auth.schema'
import express from 'express'
const route = express.Router()

route.post('/', validateRequest(LoginSchema), AuthController.POST)
route.delete('/', AuthController.DELETE)

export default route