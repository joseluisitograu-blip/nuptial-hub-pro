
-- Storage bucket for wedding photos
INSERT INTO storage.buckets (id, name, public) VALUES ('wedding-photos', 'wedding-photos', true);

-- Weddings table
CREATE TABLE public.weddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  partner1_name TEXT NOT NULL DEFAULT '',
  partner2_name TEXT NOT NULL DEFAULT '',
  wedding_date TIMESTAMPTZ,
  ceremony_venue TEXT DEFAULT '',
  ceremony_address TEXT DEFAULT '',
  reception_venue TEXT DEFAULT '',
  reception_address TEXT DEFAULT '',
  ceremony_time TEXT DEFAULT '',
  reception_time TEXT DEFAULT '',
  bank_account TEXT DEFAULT '',
  gift_message TEXT DEFAULT '',
  dress_code TEXT DEFAULT '',
  hero_image_url TEXT DEFAULT '',
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  custom_colors JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;

-- Owner can do everything
CREATE POLICY "Owner full access" ON public.weddings FOR ALL USING (auth.uid() = user_id);
-- Anyone can read via slug (public wedding pages)
CREATE POLICY "Public read by slug" ON public.weddings FOR SELECT USING (true);

-- RSVPs
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  email TEXT DEFAULT '',
  attending BOOLEAN NOT NULL DEFAULT true,
  num_guests INTEGER NOT NULL DEFAULT 1,
  dietary_notes TEXT DEFAULT '',
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can RSVP" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Owner reads RSVPs" ON public.rsvps FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.weddings WHERE weddings.id = rsvps.wedding_id AND weddings.user_id = auth.uid())
);

-- Photos wall
CREATE TABLE public.wedding_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  uploaded_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wedding_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can upload photos" ON public.wedding_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view photos" ON public.wedding_photos FOR SELECT USING (true);

-- Collaborative playlist
CREATE TABLE public.playlist_songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  song_title TEXT NOT NULL,
  artist TEXT DEFAULT '',
  suggested_by TEXT DEFAULT '',
  votes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can suggest songs" ON public.playlist_songs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view songs" ON public.playlist_songs FOR SELECT USING (true);
CREATE POLICY "Anyone can vote" ON public.playlist_songs FOR UPDATE USING (true) WITH CHECK (true);

-- Storage policies for wedding photos
CREATE POLICY "Anyone can upload wedding photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wedding-photos');
CREATE POLICY "Anyone can view wedding photos" ON storage.objects FOR SELECT USING (bucket_id = 'wedding-photos');
