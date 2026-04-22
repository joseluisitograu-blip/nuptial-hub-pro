INSERT INTO public.user_roles (user_id, role)
VALUES ('4c5c73d7-79b2-4fc7-9b10-8071580d27dd', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;