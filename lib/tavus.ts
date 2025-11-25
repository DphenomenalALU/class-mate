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

