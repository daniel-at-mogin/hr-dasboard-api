import express from "express";
import { createEmployee, deleteEmployee, getAllEmployees, getEmployeeById, updateProfile } from "../controller/employee-controller";
import { validateData } from "../middleware/validation-middleware";
import { CreateUserSchema, UpdateUserProfileSchema } from "../schema/user-schema";
const route = express.Router();

route.get('/', getAllEmployees);
route.post('/', validateData(CreateUserSchema), createEmployee);
route.delete('/:user_id', deleteEmployee);
route.get('/:user_id', getEmployeeById);
route.put('/:user_id?', validateData(UpdateUserProfileSchema), updateProfile);

export default route;