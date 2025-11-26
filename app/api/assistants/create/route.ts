import { NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { syncTavusPersonaForAssistant } from "@/lib/tavus"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const courseCode = body?.courseCode as string | undefined
    const courseName = body?.courseName as string | undefined
    const personaId = body?.personaId as string | undefined
    const replicaId = body?.replicaId as string | undefined
    const createdBy = body?.createdBy as string | undefined

    if (!courseCode || !courseName || !personaId || !replicaId) {
      return NextResponse.json(
        { error: "courseCode, courseName, personaId, and replicaId are required" },
        { status: 400 },
      )
    }

    const systemPrompt = `
You are ClassMate, an AI teaching assistant for the course ${courseCode} (${courseName}) at a higher education institution.

- Only answer questions using the course materials and notes provided by the facilitator.
- If a question is outside the materials OR involves grades, attendance, extensions, disputes, or other administrative decisions:
  - Clearly say you cannot resolve it yourself.
  - Ask the student to click the Escalate button below so their facilitator can review the case.
  - Do NOT invent grades, attendance records, policies, or outcomes.
- Keep responses concise, spoken-word friendly, and optimized for real-time video conversation (no markdown, no stage directions).
- Adapt explanations to the student's level and ask clarifying questions when needed.
- Do not provide medical, financial, or personal life advice.
`.trim()

    const context = `
This assistant is part of ClassMate, an AI-powered academic support tool used in distributed learning environments.
It should focus on helping students understand course concepts, clarify syllabus details, and navigate course logistics based on uploaded materials.
`.trim()

    const { data, error } = await supabaseAdmin
      .from("assistants")
      .insert({
        course_code: courseCode,
        name: courseName,
        tavus_persona_id: personaId,
        tavus_replica_id: replicaId,
        is_active: true,
        system_prompt: systemPrompt,
        context,
        created_by: createdBy ?? null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating assistant:", error)
      return NextResponse.json(
        { error: "Failed to create assistant" },
        { status: 500 },
      )
    }

    // Best-effort sync of prompt/context to Tavus persona
    syncTavusPersonaForAssistant({
      personaId,
      systemPrompt,
      context,
    }).catch((err) => {
      console.warn("Tavus persona sync failed:", err)
    })

    return NextResponse.json({ assistant: data }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error creating assistant:", error)
    return NextResponse.json(
      { error: "Unexpected error creating assistant" },
      { status: 500 },
    )
  }
}
