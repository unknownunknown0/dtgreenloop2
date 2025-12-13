-- Add delivery_partner to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'delivery_partner';

-- Create delivery assignments table for tracking pickups assigned to delivery partners
CREATE TABLE public.delivery_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_id UUID REFERENCES public.pickups(id) ON DELETE CASCADE NOT NULL,
  delivery_partner_id UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_transit', 'picked_up', 'delivered', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  route_order INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on delivery_assignments
ALTER TABLE public.delivery_assignments ENABLE ROW LEVEL SECURITY;

-- Delivery partners can view their own assignments
CREATE POLICY "Delivery partners can view their assignments"
ON public.delivery_assignments
FOR SELECT
USING (delivery_partner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Delivery partners can update their own assignments
CREATE POLICY "Delivery partners can update their assignments"
ON public.delivery_assignments
FOR UPDATE
USING (delivery_partner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all delivery assignments
CREATE POLICY "Admins can manage delivery assignments"
ON public.delivery_assignments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to insert delivery assignments
CREATE POLICY "Admins can insert delivery assignments"
ON public.delivery_assignments
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Update profiles table to include partner-specific fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS vehicle_number TEXT,
ADD COLUMN IF NOT EXISTS vehicle_type TEXT,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS current_latitude NUMERIC,
ADD COLUMN IF NOT EXISTS current_longitude NUMERIC;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_delivery_assignment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for updating timestamps
CREATE TRIGGER update_delivery_assignments_updated_at
BEFORE UPDATE ON public.delivery_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_delivery_assignment_updated_at();

-- Enable realtime for delivery_assignments
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_assignments;