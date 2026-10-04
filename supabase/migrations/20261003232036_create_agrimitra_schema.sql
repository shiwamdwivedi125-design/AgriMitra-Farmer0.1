/*
# AgriMitra - Complete Database Schema

## Overview
Creates the full database schema for AgriMitra, an AI-powered agriculture marketplace
and farm management platform. This is a multi-user app with authentication.

## New Tables

1. **profiles** - Farmer profile information (land area, location, etc.)
   - Extends auth.users with farmer-specific fields
   - One row per authenticated user

2. **categories** - Product categories (Seeds, Fertilizers, Pesticides, etc.)
   - Seed data inserted for 9 categories

3. **products** - Agriculture store products
   - Linked to categories
   - Includes brand, price, stock, rating, usage, description

4. **orders** - Customer orders
   - Linked to user (farmer)
   - Tracks status: pending, confirmed, shipped, delivered

5. **order_items** - Individual items within an order
   - Linked to orders and products

6. **expenses** - Farm expense records
   - Linked to user, categorized (seeds, fertilizer, labour, etc.)

7. **equipment** - Rental equipment listings
   - Tractors, harvesters, sprayers, etc.

8. **equipment_bookings** - Equipment rental bookings
   - Linked to user and equipment

9. **bazaar_listings** - Farmer-to-farmer marketplace listings
   - Farmers list their crops for sale

10. **farm_diary** - Digital farm diary entries
    - Tracks crop cycle from sowing to harvest

## Security
- RLS enabled on all tables
- Owner-scoped policies using auth.uid() for user data
- Public read access for products, categories, equipment (store catalog)
- Authenticated insert/update/delete for user's own data
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  mobile text,
  email text,
  village text,
  district text,
  state text,
  land_area numeric,
  land_unit text DEFAULT 'Katha',
  current_crop text,
  role text DEFAULT 'farmer',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ CATEGORIES ============
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_categories" ON categories;
CREATE POLICY "read_categories" ON categories FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_categories" ON categories;
CREATE POLICY "insert_categories" ON categories FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- ============ PRODUCTS ============
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  price numeric NOT NULL,
  stock int DEFAULT 0,
  rating numeric DEFAULT 4.0,
  usage text,
  description text,
  image_url text,
  unit text DEFAULT 'unit',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_products" ON products;
CREATE POLICY "read_products" ON products FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_products" ON products;
CREATE POLICY "insert_products" ON products FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_products" ON products;
CREATE POLICY "update_products" ON products FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_products" ON products;
CREATE POLICY "delete_products" ON products FOR DELETE
TO anon, authenticated USING (true);

-- ============ ORDERS ============
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  total numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'pending',
  delivery_address text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ ORDER ITEMS ============
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- ============ EXPENSES ============
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  amount numeric NOT NULL,
  description text,
  crop text,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_expenses" ON expenses;
CREATE POLICY "select_own_expenses" ON expenses FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_expenses" ON expenses;
CREATE POLICY "insert_own_expenses" ON expenses FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_expenses" ON expenses;
CREATE POLICY "update_own_expenses" ON expenses FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_expenses" ON expenses;
CREATE POLICY "delete_own_expenses" ON expenses FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============ EQUIPMENT ============
CREATE TABLE IF NOT EXISTS equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text,
  price_per_hour numeric,
  price_per_day numeric,
  description text,
  image_url text,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_equipment" ON equipment;
CREATE POLICY "read_equipment" ON equipment FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_equipment" ON equipment;
CREATE POLICY "insert_equipment" ON equipment FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- ============ EQUIPMENT BOOKINGS ============
CREATE TABLE IF NOT EXISTS equipment_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  equipment_id uuid NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  duration_hours numeric DEFAULT 1,
  total_price numeric NOT NULL,
  location text,
  status text DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE equipment_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookings" ON equipment_bookings;
CREATE POLICY "select_own_bookings" ON equipment_bookings FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookings" ON equipment_bookings;
CREATE POLICY "insert_own_bookings" ON equipment_bookings FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============ BAZAAR LISTINGS ============
CREATE TABLE IF NOT EXISTS bazaar_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_name text NOT NULL,
  quantity numeric NOT NULL,
  quantity_unit text DEFAULT 'Quintal',
  price_per_unit numeric NOT NULL,
  location text,
  description text,
  quality text DEFAULT 'A Grade',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE bazaar_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_bazaar" ON bazaar_listings;
CREATE POLICY "read_bazaar" ON bazaar_listings FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_bazaar" ON bazaar_listings;
CREATE POLICY "insert_bazaar" ON bazaar_listings FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bazaar" ON bazaar_listings;
CREATE POLICY "update_own_bazaar" ON bazaar_listings FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bazaar" ON bazaar_listings;
CREATE POLICY "delete_own_bazaar" ON bazaar_listings FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============ FARM DIARY ============
CREATE TABLE IF NOT EXISTS farm_diary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  crop text NOT NULL,
  season text,
  sowing_date date,
  harvest_date date,
  land_area numeric,
  land_unit text DEFAULT 'Katha',
  fertilizer_used text,
  pesticide_used text,
  irrigation_detail text,
  labour_cost numeric DEFAULT 0,
  disease_history text,
  total_investment numeric DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  notes text,
  status text DEFAULT 'ongoing',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE farm_diary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_diary" ON farm_diary;
CREATE POLICY "select_own_diary" ON farm_diary FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_diary" ON farm_diary;
CREATE POLICY "insert_own_diary" ON farm_diary FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_diary" ON farm_diary;
CREATE POLICY "update_own_diary" ON farm_diary FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_diary" ON farm_diary;
CREATE POLICY "delete_own_diary" ON farm_diary FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============ SEED DATA ============
INSERT INTO categories (name, icon) VALUES
  ('Seeds', 'Sprout'),
  ('Fertilizers', 'FlaskConical'),
  ('Pesticides', 'Bug'),
  ('Organic Products', 'Leaf'),
  ('Farming Equipment', 'Tractor'),
  ('Irrigation', 'Droplets'),
  ('Farming Tools', 'Wrench'),
  ('Plants/Saplings', 'TreePine'),
  ('Animal Feed', 'Wheat')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, brand, category_id, price, stock, rating, usage, description, image_url, unit) VALUES
  ('Wheat Seed (HD-2967)', 'IFFCO', (SELECT id FROM categories WHERE name='Seeds'), 320, 500, 4.5, '8 kg per Katha for Rabi season', 'High-yielding wheat variety suitable for Rabi season. Resistant to common diseases.', 'https://images.pexels.com/photos/11288849/pexels-photo-11288849.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'kg'),
  ('Paddy Seed (Pusa-44)', 'Pusa', (SELECT id FROM categories WHERE name='Seeds'), 280, 300, 4.3, '10 kg per Katha for Kharif', 'Premium paddy seed variety with high grain quality and disease resistance.', 'https://images.pexels.com/photos/5602330/pexels-photo-5602330.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'kg'),
  ('Mustard Seed (Pusa-Vijay)', 'Pusa', (SELECT id FROM categories WHERE name='Seeds'), 450, 200, 4.4, '2 kg per Katha for Rabi', 'High-yielding mustard variety with good oil content.', 'https://images.pexels.com/photos/20161587/pexels-photo-20161587.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'kg'),
  ('Urea Fertilizer', 'IFFCO', (SELECT id FROM categories WHERE name='Fertilizers'), 270, 1000, 4.6, '10 kg per Katha for Wheat', 'Nitrogen-rich fertilizer essential for crop growth and development.', 'https://images.pexels.com/photos/4433935/pexels-photo-4433935.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'kg'),
  ('DAP Fertilizer', 'IFFCO', (SELECT id FROM categories WHERE name='Fertilizers'), 1350, 800, 4.7, '8 kg per Katha base dose', 'Di-Ammonium Phosphate - provides phosphorus and nitrogen for root development.', 'https://images.pexels.com/photos/4433935/pexels-photo-4433935.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'kg'),
  ('Micronutrient Mix', 'Bayer', (SELECT id FROM categories WHERE name='Fertilizers'), 600, 400, 4.2, '2 kg per Katha supplement', 'Complete micronutrient mixture for balanced crop nutrition.', 'https://images.pexels.com/photos/4433935/pexels-photo-4433935.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'kg'),
  ('Chlorpyriphos Insecticide', 'Bayer', (SELECT id FROM categories WHERE name='Pesticides'), 450, 300, 4.1, '1-2 ml per litre water spray', 'Broad-spectrum insecticide effective against soil pests and borers.', 'https://images.pexels.com/photos/20161587/pexels-photo-20161587.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'bottle'),
  ('Mancozeb Fungicide', 'Syngenta', (SELECT id FROM categories WHERE name='Pesticides'), 380, 250, 4.3, '2.5 g per litre water spray', 'Contact fungicide for control of fungal diseases in various crops.', 'https://images.pexels.com/photos/20161587/pexels-photo-20161587.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'kg'),
  ('Neem Organic Pesticide', 'Organic India', (SELECT id FROM categories WHERE name='Organic Products'), 350, 500, 4.5, '5 ml per litre water spray', '100% natural neem-based pesticide. Safe for organic farming.', 'https://images.pexels.com/photos/12150151/pexels-photo-12150151.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'litre'),
  ('Vermicompost', 'GreenGold', (SELECT id FROM categories WHERE name='Organic Products'), 150, 1000, 4.8, '20 kg per Katha soil amendment', 'Premium organic compost rich in nutrients. Improves soil health.', 'https://images.pexels.com/photos/12150151/pexels-photo-12150151.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'kg'),
  ('Drip Irrigation Kit', 'Jain Irrigation', (SELECT id FROM categories WHERE name='Irrigation'), 2500, 100, 4.4, 'Suitable for 1 acre coverage', 'Complete drip irrigation kit with pipes, emitters and filter. Water-efficient.', 'https://images.pexels.com/photos/39507429/pexels-photo-39507429.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'set'),
  ('Sprinkler System', 'Jain Irrigation', (SELECT id FROM categories WHERE name='Irrigation'), 1800, 150, 4.2, 'Coverage up to 0.5 acre', 'Portable sprinkler irrigation system for uniform water distribution.', 'https://images.pexels.com/photos/39507429/pexels-photo-39507429.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'set'),
  ('Garden Hoe Tool', 'LocalCraft', (SELECT id FROM categories WHERE name='Farming Tools'), 450, 200, 4.0, 'Manual weeding and tilling', 'Durable steel hoe with wooden handle for everyday farm use.', 'https://images.pexels.com/photos/4433935/pexels-photo-4433935.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'piece'),
  ('Sickle (Pusa Model)', 'AgriTools', (SELECT id FROM categories WHERE name='Farming Tools'), 180, 500, 4.3, 'Harvesting and cutting', 'Sharp serrated sickle for efficient crop harvesting.', 'https://images.pexels.com/photos/4433935/pexels-photo-4433935.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'piece'),
  ('Mango Sapling (Dasheri)', 'Nursery Plus', (SELECT id FROM categories WHERE name='Plants/Saplings'), 120, 800, 4.5, 'Plant 10x10 m apart', 'Premium grafted mango sapling. Fruits in 3-4 years.', 'https://images.pexels.com/photos/39171178/pexels-photo-39171178.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'piece'),
  ('Cattle Feed Premium', 'Amrit Feeds', (SELECT id FROM categories WHERE name='Animal Feed'), 1400, 600, 4.6, '2-3 kg per cattle daily', 'Nutrient-rich cattle feed for improved milk production.', 'https://images.pexels.com/photos/5662706/pexels-photo-5662706.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', 'kg')
ON CONFLICT DO NOTHING;

INSERT INTO equipment (name, type, price_per_hour, price_per_day, description, image_url, available) VALUES
  ('Tractor (45 HP)', 'Tractor', 1200, 8000, '45 HP tractor suitable for ploughing, tilling and hauling. Comes with operator.', 'https://images.pexels.com/photos/35637717/pexels-photo-35637717.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', true),
  ('Combine Harvester', 'Harvester', 2000, 14000, 'Self-propelled combine harvester for wheat and paddy harvesting. Efficient and fast.', 'https://images.pexels.com/photos/27037415/pexels-photo-27037415.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', true),
  ('Rotavator', 'Rotavator', 800, 5000, 'Tractor-mounted rotavator for seedbed preparation. Breaks soil finely.', 'https://images.pexels.com/photos/8073972/pexels-photo-8073972.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', true),
  ('Power Sprayer', 'Sprayer', 500, 2500, 'High-pressure power sprayer for pesticide and fertilizer application.', 'https://images.pexels.com/photos/19069034/pexels-photo-19069034.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', true),
  ('Seed Drill Machine', 'Seeder', 900, 6000, 'Tractor-mounted seed drill for uniform sowing. Saves time and seeds.', 'https://images.pexels.com/photos/27054126/pexels-photo-27054126.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', true),
  ('Cultivator', 'Cultivator', 700, 4500, 'Tractor-mounted cultivator for weed control and soil aeration.', 'https://images.pexels.com/photos/34072323/pexels-photo-34072323.jpeg?auto=compress&cs=tinysrgb&h=400&w=400', true)
ON CONFLICT DO NOTHING;
