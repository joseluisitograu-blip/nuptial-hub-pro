export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accommodations: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          sort_order: number
          website: string | null
          wedding_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          sort_order?: number
          website?: string | null
          wedding_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          sort_order?: number
          website?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accommodations_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      agenda_items: {
        Row: {
          created_at: string
          description: string
          end_time: string
          icon: string
          id: string
          location: string
          sort_order: number
          start_time: string
          title: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          end_time?: string
          icon?: string
          id?: string
          location?: string
          sort_order?: number
          start_time?: string
          title: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          description?: string
          end_time?: string
          icon?: string
          id?: string
          location?: string
          sort_order?: number
          start_time?: string
          title?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agenda_items_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
          subject: string
        }
        Insert: {
          created_at?: string
          email?: string
          id?: string
          message: string
          name: string
          read?: boolean
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          subject?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          question: string
          sort_order: number
          wedding_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question: string
          sort_order?: number
          wedding_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question?: string
          sort_order?: number
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "faqs_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      guestbook: {
        Row: {
          audio_url: string | null
          author_name: string
          created_at: string
          id: string
          message: string
          wedding_id: string
        }
        Insert: {
          audio_url?: string | null
          author_name: string
          created_at?: string
          id?: string
          message: string
          wedding_id: string
        }
        Update: {
          audio_url?: string | null
          author_name?: string
          created_at?: string
          id?: string
          message?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guestbook_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_songs: {
        Row: {
          artist: string | null
          created_at: string
          id: string
          song_title: string
          suggested_by: string | null
          votes: number
          wedding_id: string
        }
        Insert: {
          artist?: string | null
          created_at?: string
          id?: string
          song_title: string
          suggested_by?: string | null
          votes?: number
          wedding_id: string
        }
        Update: {
          artist?: string | null
          created_at?: string
          id?: string
          song_title?: string
          suggested_by?: string | null
          votes?: number
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_songs_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          created_at: string | null
          environment: string
          id: string
          paddle_customer_id: string
          paddle_transaction_id: string
          price_id: string
          product_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          environment?: string
          id?: string
          paddle_customer_id: string
          paddle_transaction_id: string
          price_id: string
          product_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          environment?: string
          id?: string
          paddle_customer_id?: string
          paddle_transaction_id?: string
          price_id?: string
          product_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          attending: boolean
          created_at: string
          dietary_notes: string | null
          email: string | null
          guest_name: string
          id: string
          message: string | null
          num_guests: number
          wedding_id: string
        }
        Insert: {
          attending?: boolean
          created_at?: string
          dietary_notes?: string | null
          email?: string | null
          guest_name: string
          id?: string
          message?: string | null
          num_guests?: number
          wedding_id: string
        }
        Update: {
          attending?: boolean
          created_at?: string
          dietary_notes?: string | null
          email?: string | null
          guest_name?: string
          id?: string
          message?: string | null
          num_guests?: number
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      seating_assignments: {
        Row: {
          created_at: string
          guest_name: string
          id: string
          table_id: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          guest_name: string
          id?: string
          table_id: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          guest_name?: string
          id?: string
          table_id?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seating_assignments_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "seating_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seating_assignments_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      seating_tables: {
        Row: {
          capacity: number
          created_at: string
          id: string
          sort_order: number
          table_name: string
          wedding_id: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          id?: string
          sort_order?: number
          table_name: string
          wedding_id: string
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          sort_order?: number
          table_name?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seating_tables_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_budget_items: {
        Row: {
          actual_cost: number
          category: string
          created_at: string
          description: string
          estimated_cost: number
          id: string
          is_paid: boolean
          notes: string
          payment_date: string | null
          sort_order: number
          updated_at: string
          vendor_name: string
          wedding_id: string
        }
        Insert: {
          actual_cost?: number
          category?: string
          created_at?: string
          description?: string
          estimated_cost?: number
          id?: string
          is_paid?: boolean
          notes?: string
          payment_date?: string | null
          sort_order?: number
          updated_at?: string
          vendor_name?: string
          wedding_id: string
        }
        Update: {
          actual_cost?: number
          category?: string
          created_at?: string
          description?: string
          estimated_cost?: number
          id?: string
          is_paid?: boolean
          notes?: string
          payment_date?: string | null
          sort_order?: number
          updated_at?: string
          vendor_name?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_budget_items_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_gifts: {
        Row: {
          created_at: string
          description: string
          estimated_value: number
          gift_type: string
          guest_name: string
          id: string
          notes: string
          thank_you_sent: boolean
          wedding_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          estimated_value?: number
          gift_type?: string
          guest_name?: string
          id?: string
          notes?: string
          thank_you_sent?: boolean
          wedding_id: string
        }
        Update: {
          created_at?: string
          description?: string
          estimated_value?: number
          gift_type?: string
          guest_name?: string
          id?: string
          notes?: string
          thank_you_sent?: boolean
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_gifts_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          photo_url: string
          uploaded_by: string | null
          wedding_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          photo_url: string
          uploaded_by?: string | null
          wedding_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          photo_url?: string
          uploaded_by?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_photos_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_stories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          sort_order: number
          story_date: string | null
          title: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          story_date?: string | null
          title: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          story_date?: string | null
          title?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_stories_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      weddings: {
        Row: {
          bank_account: string | null
          ceremony_address: string | null
          ceremony_time: string | null
          ceremony_venue: string | null
          created_at: string
          custom_colors: Json | null
          dress_code: string | null
          gift_message: string | null
          hero_image_url: string | null
          id: string
          location_lat: number | null
          location_lng: number | null
          menu_desserts: string | null
          menu_mains: string | null
          menu_starters: string | null
          partner1_name: string
          partner2_name: string
          reception_address: string | null
          reception_time: string | null
          reception_venue: string | null
          slug: string
          theme_preset: string | null
          updated_at: string
          user_id: string
          wedding_date: string | null
          whatsapp_number: string | null
        }
        Insert: {
          bank_account?: string | null
          ceremony_address?: string | null
          ceremony_time?: string | null
          ceremony_venue?: string | null
          created_at?: string
          custom_colors?: Json | null
          dress_code?: string | null
          gift_message?: string | null
          hero_image_url?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          menu_desserts?: string | null
          menu_mains?: string | null
          menu_starters?: string | null
          partner1_name?: string
          partner2_name?: string
          reception_address?: string | null
          reception_time?: string | null
          reception_venue?: string | null
          slug: string
          theme_preset?: string | null
          updated_at?: string
          user_id: string
          wedding_date?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          bank_account?: string | null
          ceremony_address?: string | null
          ceremony_time?: string | null
          ceremony_venue?: string | null
          created_at?: string
          custom_colors?: Json | null
          dress_code?: string | null
          gift_message?: string | null
          hero_image_url?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          menu_desserts?: string | null
          menu_mains?: string | null
          menu_starters?: string | null
          partner1_name?: string
          partner2_name?: string
          reception_address?: string | null
          reception_time?: string | null
          reception_venue?: string | null
          slug?: string
          theme_preset?: string | null
          updated_at?: string
          user_id?: string
          wedding_date?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
