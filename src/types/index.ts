export interface Organization {
  id: string
  slug: string
  name: string
  logo_url?: string
  phone?: string
  email?: string
  whatsapp_number?: string
  timezone: string
  currency: string
  plan_tier: 'mvp' | 'growth' | 'premium'
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  organization_id: string
  role: 'owner' | 'barber' | 'receptionist' | 'manager'
  full_name: string
  display_name?: string
  email: string
  phone?: string
  avatar_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  organization_id: string
  full_name: string
  phone: string
  email?: string
  segment: 'new' | 'regular' | 'vip' | 'at_risk' | 'churned'
  trust_score: number
  total_bookings: number
  completed_bookings: number
  no_show_count: number
  total_spent: number
  is_blocked: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  organization_id: string
  name: string
  description?: string
  price: number
  duration_minutes: number
  category: 'cut' | 'beard' | 'combo' | 'treatment' | 'other'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  organization_id: string
  client_id: string
  barber_id: string
  service_id: string
  scheduled_at: string
  duration_minutes: number
  ends_at: string
  status: 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'no_show' | 'cancelled'
  confirmed_at?: string
  checked_in_at?: string
  completed_at?: string
  cancelled_at?: string
  service_price: number
  prepayment_required: boolean
  prepayment_amount?: number
  prepayment_status?: 'not_required' | 'pending' | 'paid' | 'refunded'
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata?: Record<string, any>
  app_metadata?: Record<string, any>
}

export interface Session {
  user: AuthUser | null
  organization: Organization | null
  profile: User | null
}
