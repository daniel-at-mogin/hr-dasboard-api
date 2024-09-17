import EmployeeController from '@/controllers/employees'
import express from 'express'
const route = express.Router()

route.get('/', EmployeeController.GET)

export default route