
-- Budget items table
CREATE TABLE public.wedding_budget_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT '',
  vendor_name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  estimated_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  actual_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  payment_date DATE,
  notes TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wedding_budget_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can view budget items"
  ON public.wedding_budget_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = wedding_budget_items.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Owner can insert budget items"
  ON public.wedding_budget_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = wedding_budget_items.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Owner can update budget items"
  ON public.wedding_budget_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = wedding_budget_items.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Owner can delete budget items"
  ON public.wedding_budget_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = wedding_budget_items.wedding_id AND weddings.user_id = auth.uid()));

-- Gifts tracking table
CREATE TABLE public.wedding_gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  estimated_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  gift_type TEXT NOT NULL DEFAULT 'physical',
  thank_you_sent BOOLEAN NOT NULL DEFAULT false,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wedding_gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can view gifts"
  ON public.wedding_gifts FOR SELECT
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = wedding_gifts.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Owner can insert gifts"
  ON public.wedding_gifts FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = wedding_gifts.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Owner can update gifts"
  ON public.wedding_gifts FOR UPDATE
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = wedding_gifts.wedding_id AND weddings.user_id = auth.uid()));

CREATE POLICY "Owner can delete gifts"
  ON public.wedding_gifts FOR DELETE
  USING (EXISTS (SELECT 1 FROM weddings WHERE weddings.id = wedding_gifts.wedding_id AND weddings.user_id = auth.uid()));
