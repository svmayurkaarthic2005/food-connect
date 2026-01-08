-- Add location columns to restaurants table
ALTER TABLE public.restaurants
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;

-- Add location columns to ngos table
ALTER TABLE public.ngos
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;