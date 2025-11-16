import { createClient } from '@supabase/supabase-js'

// IMPORTANTE: Substitua estas credenciais pelas suas do Supabase
// Acesse: https://supabase.com/dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
