
-- Fix contact_messages RLS policies that reference auth.users (causes permission denied)
-- Replace with auth.jwt() approach

DROP POLICY IF EXISTS "Owner can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Owner can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Owner can delete contact messages" ON public.contact_messages;

CREATE POLICY "Owner can view contact messages"
ON public.contact_messages FOR SELECT TO authenticated
USING (auth.jwt() ->> 'email' = 'joseluisitograu@gmail.com');

CREATE POLICY "Owner can update contact messages"
ON public.contact_messages FOR UPDATE TO authenticated
USING (auth.jwt() ->> 'email' = 'joseluisitograu@gmail.com');

CREATE POLICY "Owner can delete contact messages"
ON public.contact_messages FOR DELETE TO authenticated
USING (auth.jwt() ->> 'email' = 'joseluisitograu@gmail.com');
