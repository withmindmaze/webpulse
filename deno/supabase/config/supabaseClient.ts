//@ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://kckpcztvngcakrpuxvcj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default supabaseClient;
