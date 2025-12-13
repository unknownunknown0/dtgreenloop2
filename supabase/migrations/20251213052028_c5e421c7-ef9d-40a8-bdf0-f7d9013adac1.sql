-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  total_recycled_kg DECIMAL(10,2) DEFAULT 0,
  total_co2_saved_kg DECIMAL(10,2) DEFAULT 0,
  reward_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user roles table (separate from profiles for security)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create recycling companies table
CREATE TABLE public.recycling_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  waste_types TEXT[] DEFAULT '{}',
  capacity_kg DECIMAL(10,2) DEFAULT 0,
  current_load_kg DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create waste types with prices
CREATE TABLE public.waste_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waste_type TEXT NOT NULL UNIQUE,
  price_per_kg DECIMAL(10,2) NOT NULL,
  description TEXT,
  icon TEXT,
  co2_saved_per_kg DECIMAL(10,2) DEFAULT 0,
  reward_points_per_kg INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pickups/orders table
CREATE TABLE public.pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  waste_type TEXT NOT NULL,
  estimated_weight_kg DECIMAL(10,2),
  actual_weight_kg DECIMAL(10,2),
  address TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  pickup_date DATE NOT NULL,
  pickup_time_slot TEXT,
  notes TEXT,
  estimated_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  recycling_company_id UUID REFERENCES public.recycling_companies(id),
  image_url TEXT,
  ai_identified_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create art from waste items table
CREATE TABLE public.art_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  materials_used TEXT[],
  creator_name TEXT,
  is_for_sale BOOLEAN DEFAULT false,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create need things (items available from recycled materials)
CREATE TABLE public.need_things (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  price DECIMAL(10,2),
  quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recycling_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.art_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.need_things ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Recycling companies policies (public read, admin write)
CREATE POLICY "Anyone can view active recycling companies" ON public.recycling_companies
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage recycling companies" ON public.recycling_companies
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Waste prices policies (public read)
CREATE POLICY "Anyone can view waste prices" ON public.waste_prices
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage waste prices" ON public.waste_prices
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Pickups policies
CREATE POLICY "Users can view their own pickups" ON public.pickups
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pickups" ON public.pickups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending pickups" ON public.pickups
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all pickups" ON public.pickups
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all pickups" ON public.pickups
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Art items policies (public read)
CREATE POLICY "Anyone can view art items" ON public.art_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage art items" ON public.art_items
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Need things policies (public read)
CREATE POLICY "Anyone can view available items" ON public.need_things
  FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage need things" ON public.need_things
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for pickups
ALTER PUBLICATION supabase_realtime ADD TABLE public.pickups;