import { NextResponse } from "next/server"
import { createTavusConversation } from "@/lib/tavus"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    const replicaId =
      body?.replicaId ||
      process.env.TAVUS_DEFAULT_REPLICA_ID ||
      "rfb51183fe"
    const personaId =
      body?.personaId ||
      process.env.TAVUS_DEFAULT_PERSONA_ID ||
      "p88964a7"

    const documentIds: string[] | undefined = body?.documentIds

    const conversation = await createTavusConversation({
      replicaId,
      personaId,
      documentIds,
    })

    return NextResponse.json(
      {
        conversation_id: conversation.conversation_id,
        conversation_url: conversation.conversation_url,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error creating Tavus conversation:", error)
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    )
  }
}

