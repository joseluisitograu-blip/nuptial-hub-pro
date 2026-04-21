
CREATE POLICY "Owner can delete stories"
  ON public.wedding_stories FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.weddings
    WHERE weddings.id = wedding_stories.wedding_id
      AND weddings.user_id = auth.uid()
  ));

CREATE POLICY "Owner can delete accommodations"
  ON public.accommodations FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.weddings
    WHERE weddings.id = accommodations.wedding_id
      AND weddings.user_id = auth.uid()
  ));
