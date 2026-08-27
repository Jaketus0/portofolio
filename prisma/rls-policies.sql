-- Enable RLS per tabel - explicit version
-- Copy paste ini ke Supabase SQL Editor lalu Run

-- 1. admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.admins FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.admins FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. otp_tokens
ALTER TABLE public.otp_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.otp_tokens FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.otp_tokens FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. refresh_tokens
ALTER TABLE public.refresh_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.refresh_tokens FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.refresh_tokens FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. hero_sections
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.hero_sections FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.hero_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_read" ON public.hero_sections FOR SELECT TO anon USING (true);

-- 5. social_links
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.social_links FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_read" ON public.social_links FOR SELECT TO anon USING (true);

-- 6. about_sections
ALTER TABLE public.about_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.about_sections FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.about_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_read" ON public.about_sections FOR SELECT TO anon USING (true);

-- 7. timelines
ALTER TABLE public.timelines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.timelines FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.timelines FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_read" ON public.timelines FOR SELECT TO anon USING (true);

-- 8. projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.projects FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_read" ON public.projects FOR SELECT TO anon USING (true);

-- 9. project_images
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.project_images FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.project_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_read" ON public.project_images FOR SELECT TO anon USING (true);

-- 10. skills
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.skills FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_read" ON public.skills FOR SELECT TO anon USING (true);

-- 11. services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.services FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_read" ON public.services FOR SELECT TO anon USING (true);

-- 12. contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.contact_submissions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.contact_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_insert" ON public.contact_submissions FOR INSERT TO anon WITH CHECK (true);

-- 13. contact_info
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.contact_info FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.contact_info FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_read" ON public.contact_info FOR SELECT TO anon USING (true);

-- 14. guest_messages
ALTER TABLE public.guest_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.guest_messages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.guest_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_read" ON public.guest_messages FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert" ON public.guest_messages FOR INSERT TO anon WITH CHECK (true);

-- 15. visitors
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.visitors FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.visitors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_insert" ON public.visitors FOR INSERT TO anon WITH CHECK (true);

-- 16. media_files
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.media_files FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.media_files FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 17. site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.site_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_read" ON public.site_settings FOR SELECT TO anon USING (true);

-- 18. activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_all" ON public.activity_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON public.activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Verify
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
