
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message
CREATE POLICY "Anyone can submit contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Only the owner can read messages (hardcoded owner user id lookup)
CREATE POLICY "Owner can view contact messages"
  ON public.contact_messages FOR SELECT
  USING (
    auth.uid() IN (
      SELECT au.id FROM auth.users au WHERE au.email = 'joseluisitograu@gmail.com'
    )
  );

-- Owner can update (mark as read) and delete
CREATE POLICY "Owner can update contact messages"
  ON public.contact_messages FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT au.id FROM auth.users au WHERE au.email = 'joseluisitograu@gmail.com'
    )
  );

CREATE POLICY "Owner can delete contact messages"
  ON public.contact_messages FOR DELETE
  USING (
    auth.uid() IN (
      SELECT au.id FROM auth.users au WHERE au.email = 'joseluisitograu@gmail.com'
    )
  );
