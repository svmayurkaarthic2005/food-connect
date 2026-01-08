-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create matches" ON public.matches;

-- Create a new INSERT policy that allows both restaurants and NGOs to create matches
CREATE POLICY "NGOs and restaurants can create matches" 
ON public.matches 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    -- Restaurant owner can create matches for their food listings
    EXISTS (
      SELECT 1 FROM food_listings fl
      JOIN restaurants r ON fl.restaurant_id = r.id
      WHERE fl.id = matches.food_listing_id AND r.user_id = auth.uid()
    )
    OR
    -- NGO can create matches for themselves (requesting food)
    EXISTS (
      SELECT 1 FROM ngos n
      WHERE n.id = matches.ngo_id AND n.user_id = auth.uid()
    )
    OR
    -- Admins can create any matches
    has_role(auth.uid(), 'admin'::user_role)
  )
);