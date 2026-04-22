
CREATE TABLE public.wedding_checklist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  is_done BOOLEAN NOT NULL DEFAULT false,
  due_date DATE,
  notes TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wedding_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can view checklist" ON public.wedding_checklist FOR SELECT
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = wedding_checklist.wedding_id AND weddings.user_id = auth.uid()));
CREATE POLICY "Owner can insert checklist" ON public.wedding_checklist FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = wedding_checklist.wedding_id AND weddings.user_id = auth.uid()));
CREATE POLICY "Owner can update checklist" ON public.wedding_checklist FOR UPDATE
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = wedding_checklist.wedding_id AND weddings.user_id = auth.uid()));
CREATE POLICY "Owner can delete checklist" ON public.wedding_checklist FOR DELETE
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = wedding_checklist.wedding_id AND weddings.user_id = auth.uid()));
