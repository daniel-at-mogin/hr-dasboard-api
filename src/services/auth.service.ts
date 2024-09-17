import supabase from "@/config/supabase"

class AuthService {
  static POST = async (auth: { email: string, password: string }) => {
    return await supabase.auth.signInWithPassword({
      email: auth.email,
      password: auth.password
    })
  }

  static DELETE = async () => {
    return await supabase.auth.signOut()
  }
}

export default AuthService