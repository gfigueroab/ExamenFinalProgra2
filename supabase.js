import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://rdyjebmqqddnsyjfvutm.supabase.co/rest/v1/';
const supabaseAnonKey = 'sb_publishable_WzTMxAak29sblJs9fU0iwg__2FTR7fe';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});