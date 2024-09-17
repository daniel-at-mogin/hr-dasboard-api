import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { authRoute, employeeRoute, projectRoute, teamRoute } from './routes';
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRoute)
app.use('/employees', employeeRoute)
app.use('/teams', teamRoute)
app.use('/projects', projectRoute)

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));