import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import 'expo-sqlite/localStorage/install';

const supabaseUrl = "https://olqrscucaenyviiinjtm.supabase.co"
const supabaseAnonKey = "sb_publishable_CgupQ9iBY6z7Iec5h9n8FA_sloJZ63P"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})