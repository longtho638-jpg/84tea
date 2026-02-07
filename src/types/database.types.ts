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
      products: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          long_description: string | null
          price: number
          original_price: number | null
          weight: string | null
          image: string | null
          images: string[] | null
          category: 'tea' | 'teaware' | 'gift'
          type: 'green' | 'black' | 'white' | 'oolong' | 'herbal' | null
          origin: string | null
          harvest: string | null
          taste: string | null
          tags: string[] | null
          in_stock: boolean
          featured: boolean
          rating: number
          reviews_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          long_description?: string | null
          price: number
          original_price?: number | null
          weight?: string | null
          image?: string | null
          images?: string[] | null
          category: 'tea' | 'teaware' | 'gift'
          type?: 'green' | 'black' | 'white' | 'oolong' | 'herbal' | null
          origin?: string | null
          harvest?: string | null
          taste?: string | null
          tags?: string[] | null
          in_stock?: boolean
          featured?: boolean
          rating?: number
          reviews_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          long_description?: string | null
          price?: number
          original_price?: number | null
          weight?: string | null
          image?: string | null
          images?: string[] | null
          category?: 'tea' | 'teaware' | 'gift'
          type?: 'green' | 'black' | 'white' | 'oolong' | 'herbal' | null
          origin?: string | null
          harvest?: string | null
          taste?: string | null
          tags?: string[] | null
          in_stock?: boolean
          featured?: boolean
          rating?: number
          reviews_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          role: 'customer' | 'admin' | 'franchisee'
          avatar_url: string | null
          loyalty_points: number
          loyalty_tier: 'bronze' | 'silver' | 'gold' | 'diamond'
          lifetime_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin' | 'franchisee'
          avatar_url?: string | null
          loyalty_points?: number
          loyalty_tier?: 'bronze' | 'silver' | 'gold' | 'diamond'
          lifetime_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin' | 'franchisee'
          avatar_url?: string | null
          loyalty_points?: number
          loyalty_tier?: 'bronze' | 'silver' | 'gold' | 'diamond'
          lifetime_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      loyalty_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'purchase' | 'bonus' | 'redemption' | 'expiry'
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'purchase' | 'bonus' | 'redemption' | 'expiry'
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'purchase' | 'bonus' | 'redemption' | 'expiry'
          description?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_code: number
          user_id: string | null
          guest_info: Json | null
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          items: Json
          payment_status: string
          payment_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_code: number
          user_id?: string | null
          guest_info?: Json | null
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          items: Json
          payment_status?: string
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_code?: number
          user_id?: string | null
          guest_info?: Json | null
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total?: number
          items?: Json
          payment_status?: string
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payment_logs: {
        Row: {
          id: string
          event: string
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          event: string
          data: Json
          created_at?: string
        }
        Update: {
          id?: string
          event?: string
          data?: Json
          created_at?: string
        }
      }
      franchise_applications: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          location: string | null
          investment_range: string | null
          message: string | null
          status: 'pending' | 'reviewed' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone: string
          location?: string | null
          investment_range?: string | null
          message?: string | null
          status?: 'pending' | 'reviewed' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string
          location?: string | null
          investment_range?: string | null
          message?: string | null
          status?: 'pending' | 'reviewed' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
