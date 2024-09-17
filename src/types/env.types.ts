declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      SUPABASE_PROJECT_URL: string;
      SUPABASE_PUBLIC_ANON_KEY: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { };