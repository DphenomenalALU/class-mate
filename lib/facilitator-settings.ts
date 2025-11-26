import { supabaseAdmin } from "@/lib/supabase-admin"

export type FacilitatorSettings = {
  user_id: string
  tavus_api_key: string | null
  resend_api_key: string | null
  resend_from_email: string | null
}

export async function getFacilitatorSettings(userId: string | null | undefined) {
  if (!userId) return null

  const { data, error } = await supabaseAdmin
    .from("facilitator_settings")
    .select("user_id, tavus_api_key, resend_api_key, resend_from_email")
    .eq("user_id", userId)
    .single()

  if (error || !data) {
    return null
  }

  return data as FacilitatorSettings
}

