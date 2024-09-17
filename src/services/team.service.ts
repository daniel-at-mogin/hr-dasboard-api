import supabase from "@/config/supabase"
import { Database } from "@/types/database.types"

class TeamService {
  static GET = async () => {
    const result = await supabase
      .from('teams')
      .select()
      .order('id', { ascending: true })

    return result
  }

  static POST = async (teams: Team) => {
    const result = await supabase
      .from('teams')
      .insert(teams)
      .select()

    return result
  }

  static PUT = async (teamId: string, teams: Team) => {
    const result = await supabase
      .from('teams')
      .update(teams)
      .eq('id', teamId)
      .select()

    return result
  }

  static DELETE = async (teamId: number) => {
    const result = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId)
      .select()

    return result
  }
}

export default TeamService