import * as Yup from 'yup'

const LoginSchema = Yup.object({
  email: Yup.string().required().email(),
  password: Yup.string().required()
})

export {
  LoginSchema
}