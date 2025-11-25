import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    "Supabase admin client is missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Queue APIs will fail until these are set."
  )
}

export const supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!, {
  auth: {
    persistSession: false,
  },
})

