
-- Seating tables
CREATE TABLE public.seating_tables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 8,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.seating_tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view seating tables"
  ON public.seating_tables FOR SELECT USING (true);

CREATE POLICY "Owner can manage seating tables"
  ON public.seating_tables FOR ALL
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = seating_tables.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Owner can delete seating tables"
  ON public.seating_tables FOR DELETE
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = seating_tables.wedding_id AND weddings.user_id = auth.uid()));

-- Seating assignments
CREATE TABLE public.seating_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_id UUID NOT NULL REFERENCES public.seating_tables(id) ON DELETE CASCADE,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.seating_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view seating assignments"
  ON public.seating_assignments FOR SELECT USING (true);

CREATE POLICY "Owner can manage seating assignments"
  ON public.seating_assignments FOR ALL
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = seating_assignments.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Owner can delete seating assignments"
  ON public.seating_assignments FOR DELETE
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = seating_assignments.wedding_id AND weddings.user_id = auth.uid()));

-- Agenda items
CREATE TABLE public.agenda_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time TEXT NOT NULL DEFAULT '',
  end_time TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'clock',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.agenda_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view agenda"
  ON public.agenda_items FOR SELECT USING (true);

CREATE POLICY "Owner can manage agenda"
  ON public.agenda_items FOR ALL
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = agenda_items.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Owner can delete agenda"
  ON public.agenda_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = agenda_items.wedding_id AND weddings.user_id = auth.uid()));

-- FAQs
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view faqs"
  ON public.faqs FOR SELECT USING (true);

CREATE POLICY "Owner can manage faqs"
  ON public.faqs FOR ALL
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = faqs.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Owner can delete faqs"
  ON public.faqs FOR DELETE
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = faqs.wedding_id AND weddings.user_id = auth.uid()));
