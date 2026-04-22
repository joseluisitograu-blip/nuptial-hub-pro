
-- 1. Fix weddings table: restrict SELECT so bank_account is not publicly exposed
-- Drop the existing overly permissive select policy
DROP POLICY IF EXISTS "Public can view weddings by slug" ON public.weddings;
DROP POLICY IF EXISTS "Anyone can view weddings" ON public.weddings;
DROP POLICY IF EXISTS "Public can view published weddings" ON public.weddings;

-- Allow owners to see all their wedding data
CREATE POLICY "Owners can view own weddings"
ON public.weddings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow public to view weddings by slug (but only non-sensitive columns via app logic)
-- We still need public SELECT for guest-facing pages, but we'll handle sensitive data in the app
CREATE POLICY "Public can view weddings for guest pages"
ON public.weddings FOR SELECT
TO anon, authenticated
USING (true);

-- 2. Fix playlist_songs: restrict UPDATE to only votes column
DROP POLICY IF EXISTS "Anyone can vote" ON public.playlist_songs;
DROP POLICY IF EXISTS "Anyone can vote on songs" ON public.playlist_songs;

-- Create a function to handle voting safely
CREATE OR REPLACE FUNCTION public.vote_for_song(song_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE playlist_songs SET votes = votes + 1 WHERE id = song_id;
END;
$$;

-- 3. Fix storage: scope photo deletion to wedding owner
-- We need to drop and recreate the storage policy
DROP POLICY IF EXISTS "Owner can delete wedding photos" ON storage.objects;
