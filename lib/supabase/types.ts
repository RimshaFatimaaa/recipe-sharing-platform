// Minimal typed definition for your current Supabase public schema
// Keep this in sync with your Supabase tables

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // uuid
          username: string | null;
          full_name: string | null;
          created_at: string | null; // timestamptz
          updated_at: string | null; // timestamptz
          email: string | null;
          password: string | null;
        };
        Insert: {
          id: string; // must match auth.users.id
          username?: string | null;
          full_name?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          email?: string | null;
          password?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      recipes: {
        Row: {
          id: string; // uuid
          created_at: string | null; // timestamptz
          user_id: string; // uuid -> profiles.id
          title: string;
          description: string | null;
          ingredients: string | null; // using text per your table
          cooking_time: number | null; // minutes (int4)
          difficulty: string | null; // e.g. easy/medium/hard
          category: string | null;
          instructions: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          user_id: string;
          title: string;
          description?: string | null;
          ingredients?: string | null;
          cooking_time?: number | null;
          difficulty?: string | null;
          category?: string | null;
          instructions?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["recipes"]["Insert"]>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}


