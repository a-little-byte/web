import { UUID } from "crypto";

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
      users: {
        Row: {
          id: UUID;
          email: string;
          password: string;
          full_name: string | null;
          role: string;
          email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: UUID;
          email: string;
          password: string;
          full_name?: string | null;
          role?: string;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: UUID;
          email?: string;
          password?: string;
          full_name?: string | null;
          role?: string;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: UUID;
          name: string;
          description: string;
          price: number;
          period: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: UUID;
          name: string;
          description: string;
          price: number;
          period: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: UUID;
          name?: string;
          description?: string;
          price?: number;
          period?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: UUID;
          user_id: UUID;
          service_id: UUID;
          status: string;
          current_period_start: string;
          current_period_end: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          service_id: UUID;
          status?: string;
          current_period_start?: string;
          current_period_end: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: UUID;
          user_id?: UUID;
          service_id?: UUID;
          status?: string;
          current_period_start?: string;
          current_period_end?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: UUID;
          subscription_id: UUID;
          amount: number;
          status: string;
          payment_method: string;
          created_at: string;
          billing_address_id: UUID | null;
          payment_method_id: UUID | null;
        };
        Insert: {
          id?: UUID;
          subscription_id: UUID;
          amount: number;
          status: string;
          payment_method: string;
          created_at?: string;
          billing_address_id?: UUID | null;
          payment_method_id?: UUID | null;
        };
        Update: {
          id?: UUID;
          subscription_id?: UUID;
          amount?: number;
          status?: string;
          payment_method?: string;
          created_at?: string;
          billing_address_id?: UUID | null;
          payment_method_id?: UUID | null;
        };
      };
      page_content: {
        Row: {
          id: UUID;
          section: string;
          content: Json;
          updated_at: string;
        };
        Insert: {
          id?: UUID;
          section: string;
          content: Json;
          updated_at?: string;
        };
        Update: {
          id?: UUID;
          section?: string;
          content?: Json;
          updated_at?: string;
        };
      };
      chat_conversations: {
        Row: {
          id: UUID;
          user_id: UUID;
          title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: UUID;
          user_id?: UUID;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: UUID;
          conversation_id: UUID;
          role: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: UUID;
          conversation_id: UUID;
          role: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: UUID;
          conversation_id?: UUID;
          role?: string;
          content?: string;
          created_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: UUID;
          user_id: UUID;
          service_id: UUID;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          service_id: UUID;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: UUID;
          user_id?: UUID;
          service_id?: UUID;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      hero_carousel: {
        Row: {
          id: UUID;
          title: string;
          description: string;
          image_url: string;
          button_text: string | null;
          button_link: string | null;
          order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: UUID;
          title: string;
          description: string;
          image_url: string;
          button_text?: string | null;
          button_link?: string | null;
          order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: UUID;
          title?: string;
          description?: string;
          image_url?: string;
          button_text?: string | null;
          button_link?: string | null;
          order?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      billing_addresses: {
        Row: {
          id: UUID;
          user_id: UUID;
          street: string;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          street: string;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: UUID;
          user_id?: UUID;
          street?: string;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      payment_methods: {
        Row: {
          id: UUID;
          user_id: UUID;
          type: string;
          last_four: string;
          expiry_month: number;
          expiry_year: number;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: UUID;
          user_id: UUID;
          type: string;
          last_four: string;
          expiry_month: number;
          expiry_year: number;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: UUID;
          user_id?: UUID;
          type?: string;
          last_four?: string;
          expiry_month?: number;
          expiry_year?: number;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: UUID;
          payment_id: UUID;
          number: string;
          file_url: string;
          created_at: string;
        };
        Insert: {
          id?: UUID;
          payment_id: UUID;
          number: string;
          file_url: string;
          created_at?: string;
        };
        Update: {
          id?: UUID;
          payment_id?: UUID;
          number?: string;
          file_url?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
