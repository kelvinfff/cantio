import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zqttqxazkbxtjcblxvzx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxdHRxeGF6a2J4dGpjYmx4dnp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDc1NzYsImV4cCI6MjA4OTQyMzU3Nn0.kh34pZy3MT7NdzFe_WAwsDlKyomTOd3mC2bihQ8Ot_g";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});