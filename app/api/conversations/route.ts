import { NextResponse } from "next/server"

import { createTavusConversation } from "@/lib/tavus"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { getFacilitatorSettings } from "@/lib/facilitator-settings"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    const assistantId = body?.assistantId as string | undefined

    let replicaId = process.env.TAVUS_DEFAULT_REPLICA_ID || "rfb51183fe"
    let personaId = process.env.TAVUS_DEFAULT_PERSONA_ID || "p88964a7"
    let documentIds: string[] = []
    let apiKeyOverride: string | null = null

    if (assistantId) {
      const { data: assistant, error: assistantError } = await supabaseAdmin
        .from("assistants")
        .select("*")
        .eq("id", assistantId)
        .single()

      if (!assistantError && assistant) {
        replicaId = assistant.tavus_replica_id || replicaId
        personaId = assistant.tavus_persona_id || personaId

        const settings = await getFacilitatorSettings(assistant.created_by ?? null)
        apiKeyOverride = settings?.tavus_api_key ?? null
      }

      const { data: docs, error: docsError } = await supabaseAdmin
        .from("assistant_documents")
        .select("tavus_document_id")
        .eq("assistant_id", assistantId)

      if (!docsError && docs) {
        documentIds = docs.map((d) => d.tavus_document_id).filter(Boolean)
      }
    }

    const conversation = await createTavusConversation({
      replicaId,
      personaId,
      documentIds,
      apiKeyOverride,
    })

    return NextResponse.json(
      {
        conversation_id: conversation.conversation_id,
        conversation_url: conversation.conversation_url,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error creating Tavus conversation:", error)
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 },
    )
  }
}
