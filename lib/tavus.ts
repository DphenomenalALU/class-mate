const TAVUS_API_BASE = "https://tavusapi.com/v2"

const TAVUS_API_KEY = process.env.TAVUS_API_KEY

if (!TAVUS_API_KEY) {
  console.warn("Missing TAVUS_API_KEY. Tavus API calls will fail until it is set.")
}

export async function createTavusConversation(params: {
  replicaId: string
  personaId: string
  documentIds?: string[]
}) {
  const response = await fetch(`${TAVUS_API_BASE}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": TAVUS_API_KEY ?? "",
    },
    body: JSON.stringify({
      replica_id: params.replicaId,
      persona_id: params.personaId,
      document_ids: params.documentIds ?? [],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Tavus conversation error: ${response.status} ${text}`)
  }

  return (await response.json()) as {
    conversation_id: string
    conversation_url: string
  }
}

export async function createTavusDocument(params: {
  documentName: string
  documentUrl: string
  tags?: string[]
}) {
  const response = await fetch(`${TAVUS_API_BASE}/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": TAVUS_API_KEY ?? "",
    },
    body: JSON.stringify({
      document_name: params.documentName,
      document_url: params.documentUrl,
      tags: params.tags,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Tavus document error: ${response.status} ${text}`)
  }

  return (await response.json()) as {
    document_id: string
    status: string
  }
}

export async function syncTavusPersonaForAssistant(params: {
  personaId: string
  systemPrompt?: string | null
  context?: string | null
}) {
  if (!params.personaId) return
  if (!TAVUS_API_KEY) return

  const patches: Array<{ op: string; path: string; value: string }> = []

  if (params.systemPrompt) {
    patches.push({
      op: "replace",
      path: "/system_prompt",
      value: params.systemPrompt,
    })
  }

  if (params.context) {
    patches.push({
      op: "replace",
      path: "/context",
      value: params.context,
    })
  }

  // Configure LLM tool calling for trigger_escalation
  patches.push({
    op: "replace",
    path: "/layers/llm/tools",
    value: JSON.stringify([
      {
        type: "function",
        function: {
          name: "trigger_escalation",
          description:
            "Escalate the current question to the human facilitator when it is outside the course materials or involves grades, attendance, or disputes. Always explain this to the student before calling.",
          parameters: {
            type: "object",
            properties: {
              reason: {
                type: "string",
                description:
                  "A short, student-facing explanation of why this question should be escalated, in plain language.",
              },
            },
            required: ["reason"],
          },
        },
      },
    ]),
  })

  const response = await fetch(`${TAVUS_API_BASE}/personas/${params.personaId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": TAVUS_API_KEY,
    },
    body: JSON.stringify(patches),
  })

  if (!response.ok) {
    const text = await response.text()
    console.warn(`Tavus persona sync warning: ${response.status} ${text}`)
  }
}
