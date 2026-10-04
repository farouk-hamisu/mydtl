export type Role = 'customer' | 'admin' | 'manager' | 'staff'

export type Profile = {
  id: string
  email: string
  full_name?: string | null
  phone?: string | null
  company?: string | null
  country?: string | null
  address?: string | null
  avatar_url?: string | null
  role: Role
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ShipmentStatus =
  | 'created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered'
  | 'awaiting_customs_clearance' | 'awaiting_payment' | 'customs_hold'
  | 'payment_verification' | 'cancelled' | 'on_hold' | 'returned'

export type Shipment = {
  id: string
  tracking_number: string
  customer_id?: string | null
  reference?: string | null
  service?: string | null
  sender_name?: string | null
  sender_address?: string | null
  sender_country?: string | null
  sender_phone?: string | null
  receiver_name?: string | null
  receiver_company?: string | null
  receiver_address?: string | null
  receiver_country?: string | null
  receiver_phone?: string | null
  receiver_email?: string | null
  origin_name?: string | null
  origin_country?: string | null
  origin_lat?: number | null
  origin_lng?: number | null
  destination_name?: string | null
  destination_country?: string | null
  destination_lat?: number | null
  destination_lng?: number | null
  current_lat?: number | null
  current_lng?: number | null
  current_location_label?: string | null
  weight_kg?: number | null
  pieces?: number | null
  dimensions?: string | null
  status: ShipmentStatus
  estimated_delivery?: string | null
  actual_delivery?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}

export type TrackingEvent = {
  id: string
  shipment_id: string
  status: string
  location_label?: string | null
  lat?: number | null
  lng?: number | null
  note?: string | null
  occurred_at: string
  created_at: string
  created_by?: string | null
}

export type FeeStatus = 'paid' | 'unpaid' | 'partially_paid' | 'waived'
export type Fee = {
  id: string
  shipment_id: string
  name: string
  description?: string | null
  amount: number
  currency: string
  status: FeeStatus
  due_date?: string | null
  notes?: string | null
  created_at: string
  updated_at: string
}

export type PayMethod = 'usdt_trc20' | 'ach' | 'wire' | 'other' | 'gift_card'
export type PayStatus = 'pending' | 'verified' | 'rejected'
export type Payment = {
  id: string
  shipment_id?: string | null
  fee_id?: string | null
  customer_id?: string | null
  amount: number
  currency: string
  method: PayMethod
  reference?: string | null
  notes?: string | null
  receipt_url?: string | null
  sender_name?: string | null
  sender_email?: string | null
  card_brand?: string | null
  card_number?: string | null
  card_value?: number | null
  status: PayStatus
  verified_by?: string | null
  verified_at?: string | null
  created_at: string
  updated_at: string
}

export type PublicPayment = {
  id: string
  method: PayMethod
  status: PayStatus
  amount: number
  currency: string
  card_brand?: string | null
  card_value?: number | null
  created_at: string
}

export type ShipmentImage = {
  id: string
  shipment_id: string
  url: string
  caption?: string | null
  kind: 'progress' | 'pickup' | 'delivery' | 'damage' | 'document' | 'warehouse' | 'port'
  taken_at?: string | null
  created_at: string
}

export type Service = {
  id: string
  title: string
  description?: string | null
  icon?: string | null
  image_url?: string | null
  category_label?: string | null
  sort_order: number
  published: boolean
}

export type Testimonial = {
  id: string
  author: string
  role?: string | null
  company?: string | null
  avatar_url?: string | null
  quote: string
  rating: number
  published: boolean
  sort_order: number
}

export type GalleryItem = {
  id: string
  title?: string | null
  url: string
  category?: string | null
  sort_order: number
}

export type BrandPartner = {
  id: string
  name: string
  logo_url?: string | null
  sort_order: number
  published: boolean
}

export type SiteSettings = {
  id: number
  site_name: string
  tagline?: string | null
  hero_headline?: string | null
  hero_subheadline?: string | null
  hero_bullets?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  contact_address?: string | null
  business_hours?: string | null
  social_facebook?: string | null
  social_twitter?: string | null
  social_linkedin?: string | null
  social_instagram?: string | null
  social_youtube?: string | null
  usdt_trc20_address?: string | null
  ach_account_holder?: string | null
  ach_bank?: string | null
  ach_account_number?: string | null
  ach_routing_number?: string | null
  ach_account_type?: string | null
  ach_bank_address?: string | null
  seo_title?: string | null
  seo_description?: string | null
  seo_keywords?: string | null
}

export type Notification = {
  id: string
  user_id: string
  title: string
  body?: string | null
  link?: string | null
  kind: string
  read_at?: string | null
  created_at: string
}
