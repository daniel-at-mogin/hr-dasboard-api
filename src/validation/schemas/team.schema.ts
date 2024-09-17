import * as Yup from 'yup'

const CreateTeamSchema = Yup.object({
  name: Yup.string().required()
})

const UpdateTeamSchema = Yup.object({
  id: Yup.string().required(),
  name: Yup.string().required()
})

export {
  CreateTeamSchema,
  UpdateTeamSchema
}