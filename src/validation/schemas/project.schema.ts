import * as Yup from 'yup'

const CreateProjectSchema = Yup.object({
  name: Yup.string().required()
})

const UpdateProjectSchema = Yup.object({
  id: Yup.string().required(),
  name: Yup.string().required()
})

export {
  CreateProjectSchema,
  UpdateProjectSchema
}