export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password: string
          full_name: string | null
          role: string
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          full_name?: string | null
          role?: string
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          full_name?: string | null
          role?: string
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          period: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          period: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          period?: string
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          service_id: string
          status: string
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id: string
          status?: string
          current_period_start?: string
          current_period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          subscription_id: string
          amount: number
          status: string
          payment_method: string
          created_at: string
          billing_address_id: string | null
          payment_method_id: string | null
        }
        Insert: {
          id?: string
          subscription_id: string
          amount: number
          status: string
          payment_method: string
          created_at?: string
          billing_address_id?: string | null
          payment_method_id?: string | null
        }
        Update: {
          id?: string
          subscription_id?: string
          amount?: number
          status?: string
          payment_method?: string
          created_at?: string
          billing_address_id?: string | null
          payment_method_id?: string | null
        }
      }
      page_content: {
        Row: {
          id: string
          section: string
          content: Json
          updated_at: string
        }
        Insert: {
          id?: string
          section: string
          content: Json
          updated_at?: string
        }
        Update: {
          id?: string
          section?: string
          content?: Json
          updated_at?: string
        }
      }
      chat_conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          conversation_id: string
          role: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: string
          content?: string
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          service_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      hero_carousel: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string
          button_text: string | null
          button_link: string | null
          order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url: string
          button_text?: string | null
          button_link?: string | null
          order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string
          button_text?: string | null
          button_link?: string | null
          order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      billing_addresses: {
        Row: {
          id: string
          user_id: string
          street: string
          city: string
          state: string
          postal_code: string
          country: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          street: string
          city: string
          state: string
          postal_code: string
          country: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          street?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          type: string
          last_four: string
          expiry_month: number
          expiry_year: number
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          last_four: string
          expiry_month: number
          expiry_year: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          last_four?: string
          expiry_month?: number
          expiry_year?: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          payment_id: string
          number: string
          file_url: string
          created_at: string
        }
        Insert: {
          id?: string
          payment_id: string
          number: string
          file_url: string
          created_at?: string
        }
        Update: {
          id?: string
          payment_id?: string
          number?: string
          file_url?: string
          created_at?: string
        }
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
  }
}