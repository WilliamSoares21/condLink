import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = 'https://ccxujhbkqtvaljjjzdgm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjeHVqaGJrcXR2YWxqamp6ZGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NDMzNzIsImV4cCI6MjA2MDQxOTM3Mn0.oFwyJiZ27llhxdvv2wkVeTQdcYp2qPNtbBSK5PzPhPY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);