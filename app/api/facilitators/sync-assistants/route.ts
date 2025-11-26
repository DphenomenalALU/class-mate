import { NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { syncTavusPersonaForAssistant } from "@/lib/tavus"
import { getFacilitatorSettings } from "@/lib/facilitator-settings"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const userId = body?.userId as string | undefined

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const settings = await getFacilitatorSettings(userId)

    const { data: assistants, error } = await supabaseAdmin
      .from("assistants")
      .select("id, tavus_persona_id, system_prompt, context")
      .eq("created_by", userId)

    if (error) {
      console.error("Error loading assistants for resync:", error)
      return NextResponse.json(
        { error: "Failed to load assistants for resync" },
        { status: 500 },
      )
    }

    const personaIdSet = new Set<string>()
    for (const assistant of assistants || []) {
      if (!assistant.tavus_persona_id || personaIdSet.has(assistant.tavus_persona_id)) continue
      personaIdSet.add(assistant.tavus_persona_id)

      syncTavusPersonaForAssistant({
        personaId: assistant.tavus_persona_id,
        systemPrompt: assistant.system_prompt,
        context: assistant.context,
        apiKeyOverride: settings?.tavus_api_key ?? null,
      }).catch((err) => {
        console.warn("Failed to resync Tavus persona:", err)
      })
    }

    return NextResponse.json(
      { resyncedPersonas: personaIdSet.size },
      { status: 200 },
    )
  } catch (error) {
    console.error("Unexpected error during facilitator resync:", error)
    return NextResponse.json(
      { error: "Unexpected error during resync" },
      { status: 500 },
    )
  }
}

