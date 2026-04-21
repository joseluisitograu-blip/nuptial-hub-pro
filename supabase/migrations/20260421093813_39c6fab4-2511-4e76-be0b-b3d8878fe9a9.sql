
-- New table: wedding_stories (couple's love story timeline)
CREATE TABLE public.wedding_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  story_date TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wedding_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stories"
  ON public.wedding_stories FOR SELECT
  USING (true);

CREATE POLICY "Owner can manage stories"
  ON public.wedding_stories FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.weddings
    WHERE weddings.id = wedding_stories.wedding_id
      AND weddings.user_id = auth.uid()
  ));

-- New table: accommodations
CREATE TABLE public.accommodations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  website TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view accommodations"
  ON public.accommodations FOR SELECT
  USING (true);

CREATE POLICY "Owner can manage accommodations"
  ON public.accommodations FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.weddings
    WHERE weddings.id = accommodations.wedding_id
      AND weddings.user_id = auth.uid()
  ));

-- New table: guestbook
CREATE TABLE public.guestbook (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view guestbook"
  ON public.guestbook FOR SELECT
  USING (true);

CREATE POLICY "Anyone can sign guestbook"
  ON public.guestbook FOR INSERT
  WITH CHECK (true);

-- New columns on weddings for menu and theme
ALTER TABLE public.weddings
  ADD COLUMN menu_starters TEXT DEFAULT '',
  ADD COLUMN menu_mains TEXT DEFAULT '',
  ADD COLUMN menu_desserts TEXT DEFAULT '',
  ADD COLUMN theme_preset TEXT DEFAULT 'elegant';
