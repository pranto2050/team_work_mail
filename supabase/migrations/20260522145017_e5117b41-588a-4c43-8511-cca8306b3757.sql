
CREATE TABLE public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  avatar_color VARCHAR(7) DEFAULT '#6366f1',
  role VARCHAR(50) DEFAULT 'Developer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL,
  full_name VARCHAR(100),
  email VARCHAR(200),
  username VARCHAR(100),
  password VARCHAR(200) NOT NULL,
  website_url VARCHAR(300),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on team_members" ON public.team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on credentials" ON public.credentials FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX idx_credentials_member_id ON public.credentials(member_id);
CREATE INDEX idx_credentials_created_at ON public.credentials(created_at DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_credentials_updated_at
  BEFORE UPDATE ON public.credentials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
