-- Enable RLS on all tables
-- Run di Supabase SQL Editor

-- Grant schema usage (required for RLS policies to work)
GRANT USAGE ON SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

DO $$
DECLARE
  tbl text;
  all_tables text[] := ARRAY[
    'admins','otp_tokens','refresh_tokens','hero_sections','social_links',
    'about_sections','timelines','projects','project_images','skills',
    'services','contact_submissions','contact_info','guest_messages',
    'visitors','media_files','site_settings','activity_logs'
  ];
  public_read text[] := ARRAY[
    'hero_sections','social_links','about_sections','timelines',
    'projects','project_images','skills','services',
    'contact_info','guest_messages','site_settings'
  ];
  public_insert text[] := ARRAY[
    'contact_submissions','guest_messages','visitors'
  ];
BEGIN
  FOREACH tbl IN ARRAY all_tables
  LOOP
    -- Enable RLS
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);

    -- service_role: full access (Prisma uses this)
    EXECUTE format(
      'CREATE POLICY "service_role_all" ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true)',
      tbl
    );

    -- authenticated: full access (admin JWT)
    EXECUTE format(
      'CREATE POLICY "authenticated_all" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      tbl
    );
  END LOOP;

  -- anon: read-only for public-facing tables
  FOREACH tbl IN ARRAY public_read
  LOOP
    EXECUTE format(
      'CREATE POLICY "anon_read" ON public.%I FOR SELECT TO anon USING (true)',
      tbl
    );
  END LOOP;

  -- anon: insert for public submission tables
  FOREACH tbl IN ARRAY public_insert
  LOOP
    EXECUTE format(
      'CREATE POLICY "anon_insert" ON public.%I FOR INSERT TO anon WITH CHECK (true)',
      tbl
    );
  END LOOP;
END
$$;
