// Utilitaire Supabase côté serveur — utilise la clé service_role
// pour vérifier les tokens JWT émis par Supabase
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
   if (process.env.NODE_ENV !== "test") {
  throw new Error(
    "[supabaseAdmin] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env"
  );
}
}
// createClient avec service_role permet de vérifier les tokens
// et d'accéder aux données utilisateur Supabase sans restriction RLS
// export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
//   auth: {
//     autoRefreshToken: false,
//     persistSession:   false,
//   },
// });

export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : { auth: { getUser: async () => ({ data: { user: null }, error: new Error("Supabase not configured") }) } } as any;