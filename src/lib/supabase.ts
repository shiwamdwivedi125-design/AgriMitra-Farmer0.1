import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'missing-supabase-anon-key',
  {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  }
);

export type Product = {
  id: string;
  name: string;
  brand: string | null;
  category_id: string | null;
  price: number;
  stock: number;
  rating: number;
  usage: string | null;
  description: string | null;
  image_url: string | null;
  unit: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string | null;
};

export type Equipment = {
  id: string;
  name: string;
  type: string | null;
  price_per_hour: number | null;
  price_per_day: number | null;
  description: string | null;
  image_url: string | null;
  available: boolean;
};

export type BazaarListing = {
  id: string;
  user_id: string;
  crop_name: string;
  quantity: number;
  quantity_unit: string;
  price_per_unit: number;
  location: string | null;
  description: string | null;
  quality: string;
  status: string;
  created_at: string;
};

export type Expense = {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  description: string | null;
  crop: string | null;
  date: string;
  created_at: string;
};

export type FarmDiary = {
  id: string;
  user_id: string;
  crop: string;
  season: string | null;
  sowing_date: string | null;
  harvest_date: string | null;
  land_area: number | null;
  land_unit: string;
  fertilizer_used: string | null;
  pesticide_used: string | null;
  irrigation_detail: string | null;
  labour_cost: number;
  disease_history: string | null;
  total_investment: number;
  total_revenue: number;
  notes: string | null;
  status: string;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  total: number;
  status: string;
  delivery_address: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
};

export type Profile = {
  id: string;
  full_name: string;
  mobile: string | null;
  email: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  land_area: number | null;
  land_unit: string;
  current_crop: string | null;
  role: string;
  created_at: string;
};
