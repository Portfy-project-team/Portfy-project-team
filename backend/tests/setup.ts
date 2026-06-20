// tests/setup.ts
// Ce fichier est chargé avant tous les tests (voir jest.config.js → setupFiles)
 
// ── Variables d'environnement pour les tests ──────────────────────
// Ces variables doivent être définies AVANT que les modules soient importés
 
process.env.NODE_ENV                   = "test";
process.env.JWT_ACCESS_SECRET          = "test_access_secret_for_jest";
process.env.JWT_REFRESH_SECRET         = "test_refresh_secret_for_jest";
process.env.DATABASE_URL               = process.env.DATABASE_URL ?? "postgresql://postgres:Kholoud2005@localhost:5432/portfytest";
process.env.FRONTEND_URL               = "http://localhost:5173";
 
// ✅ CRITIQUE : désactiver l'envoi d'email en test
// Sans cette variable, sendVerificationEmail tente d'appeler Resend
process.env.SKIP_EMAIL_VERIFICATION    = "true";
 
// Supabase — valeurs fictives pour les tests
process.env.SUPABASE_URL               = process.env.SUPABASE_URL ?? "https://fake.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "fake_service_role_key";
 
// Resend — pas utilisé en test (NODE_ENV=test → resend = null dans mailer.ts)
process.env.RESEND_API_KEY             = process.env.RESEND_API_KEY ?? "re_fake_key_for_tests";
process.env.MAIL_FROM                  = "Portfy Test <test@portfy.ma>";