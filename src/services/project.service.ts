import supabase from "@/config/supabase"

class ProjectService {
  static GET = async () => {
    const result = await supabase
      .from('projects')
      .select()
      .order('id', { ascending: true })

    return result
  }

  static POST = async (project: Project) => {
    return await supabase
      .from('projects')
      .insert({ name: project.name })
      .select()
  }

  static PUT = async (projectId: string, project: Project) => {
    return await supabase
      .from('projects')
      .update(project)
      .eq("id", projectId)
      .select()
  }

  static DELETE = async (projectId: string) => {
    return await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .select()
  }
}

export default ProjectService