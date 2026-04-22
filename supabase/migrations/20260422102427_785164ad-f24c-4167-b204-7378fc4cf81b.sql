
-- 1. Create user_roles table and has_role function
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role manages roles"
ON public.user_roles FOR ALL
USING (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 2. Create get_wedding_by_slug function (returns one wedding, safe for public)
CREATE OR REPLACE FUNCTION public.get_wedding_by_slug(p_slug text)
RETURNS TABLE (
  id uuid,
  slug text,
  partner1_name text,
  partner2_name text,
  wedding_date timestamptz,
  ceremony_venue text,
  ceremony_address text,
  ceremony_time text,
  reception_venue text,
  reception_address text,
  reception_time text,
  bank_account text,
  gift_message text,
  dress_code text,
  hero_image_url text,
  menu_starters text,
  menu_mains text,
  menu_desserts text,
  theme_preset text,
  whatsapp_number text,
  user_id uuid,
  location_lat double precision,
  location_lng double precision,
  custom_colors jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT w.id, w.slug, w.partner1_name, w.partner2_name, w.wedding_date,
         w.ceremony_venue, w.ceremony_address, w.ceremony_time,
         w.reception_venue, w.reception_address, w.reception_time,
         w.bank_account, w.gift_message, w.dress_code, w.hero_image_url,
         w.menu_starters, w.menu_mains, w.menu_desserts, w.theme_preset,
         w.whatsapp_number, w.user_id, w.location_lat, w.location_lng,
         w.custom_colors
  FROM public.weddings w
  WHERE w.slug = p_slug
  LIMIT 1;
$$;

-- 3. Remove broad public SELECT policies on weddings
DROP POLICY IF EXISTS "Public can view weddings for guest pages" ON public.weddings;
DROP POLICY IF EXISTS "Public read by slug" ON public.weddings;

-- 4. Create has_completed_purchase function for paywall enforcement
CREATE OR REPLACE FUNCTION public.has_completed_purchase(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.purchases
    WHERE user_id = _user_id
      AND status = 'completed'
  )
$$;

-- 5. Add paywall check to weddings INSERT (owner or purchased users only)
DROP POLICY IF EXISTS "Owner full access" ON public.weddings;

CREATE POLICY "Owner full access"
ON public.weddings FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND (
    public.has_completed_purchase(auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- Keep the owner SELECT policy
-- "Owners can view own weddings" already exists

-- 6. Update contact_messages policies to use roles
DROP POLICY IF EXISTS "Owner can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Owner can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Owner can delete contact messages" ON public.contact_messages;

CREATE POLICY "Admin can view contact messages"
ON public.contact_messages FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update contact messages"
ON public.contact_messages FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete contact messages"
ON public.contact_messages FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 7. Fix vote_for_song to validate song exists
CREATE OR REPLACE FUNCTION public.vote_for_song(song_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM playlist_songs WHERE id = song_id) THEN
    RAISE EXCEPTION 'Song not found';
  END IF;
  UPDATE playlist_songs SET votes = votes + 1 WHERE id = song_id;
END;
$$;
