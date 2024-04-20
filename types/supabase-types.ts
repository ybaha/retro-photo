export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      images: {
        Row: {
          created_at: string
          description: string | null
          id: string
          prediction_id: string
          processed_url: string | null
          status: Database["public"]["Enums"]["image_status"]
          unprocessed_url: string | null
          user_id: string
          with_watermark: boolean | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          prediction_id: string
          processed_url?: string | null
          status: Database["public"]["Enums"]["image_status"]
          unprocessed_url?: string | null
          user_id: string
          with_watermark?: boolean | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          prediction_id?: string
          processed_url?: string | null
          status?: Database["public"]["Enums"]["image_status"]
          unprocessed_url?: string | null
          user_id?: string
          with_watermark?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "public_images_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          created_at: string
          id: number
          message: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: string | null
          type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance: number
          full_name: string | null
          id: string
          is_paid_user: boolean
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          balance: number
          full_name?: string | null
          id: string
          is_paid_user?: boolean
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          balance?: number
          full_name?: string | null
          id?: string
          is_paid_user?: boolean
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_stripe_info: {
        Row: {
          created_at: string
          id: string | null
          profile_id: string | null
          stripe_current_period_end: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string | null
          profile_id?: string | null
          stripe_current_period_end?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string | null
          profile_id?: string | null
          stripe_current_period_end?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_profiles_stripe_info_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          color: string | null
          company_name: string | null
          created_at: string
          description: string | null
          id: string
          logo: string | null
          profile_id: string | null
          url_id: string | null
        }
        Insert: {
          color?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo?: string | null
          profile_id?: string | null
          url_id?: string | null
        }
        Update: {
          color?: string | null
          company_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo?: string | null
          profile_id?: string | null
          url_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_themes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_themes_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "urls"
            referencedColumns: ["id"]
          },
        ]
      }
      urls: {
        Row: {
          created_at: string
          creator_id: string | null
          id: string
          slug: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          id?: string
          slug?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          id?: string
          slug?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_urls_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      image_status:
        | "pending_from_replicate"
        | "adding_watermark"
        | "completed"
        | "error"
        | "deleted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
