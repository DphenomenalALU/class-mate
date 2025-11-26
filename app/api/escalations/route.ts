import { NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { sendEscalationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const sessionId = body?.sessionId as string | undefined
    const assistantId = body?.assistantId as string | undefined
    const reason = body?.reason as string | undefined
    const source = (body?.source as "student" | "llm" | undefined) ?? "student"

    if (!sessionId || !assistantId) {
      return NextResponse.json(
        { error: "sessionId and assistantId are required" },
        { status: 400 },
      )
    }

    const { data: session, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select("id, assistant_id, student_id, status")
      .eq("id", sessionId)
      .single()

    if (sessionError || !session) {
      console.error("Error loading session:", sessionError)
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 },
      )
    }

    const { data: assistant, error: assistantError } = await supabaseAdmin
      .from("assistants")
      .select("id, course_code, name, created_by")
      .eq("id", assistantId)
      .single()

    if (assistantError || !assistant) {
      console.error("Error loading assistant:", assistantError)
      return NextResponse.json(
        { error: "Assistant not found" },
        { status: 404 },
      )
    }

    const { data: escalation, error: escalationError } = await supabaseAdmin
      .from("escalations")
      .insert({
        session_id: session.id,
        assistant_id: assistant.id,
        student_id: session.student_id,
        source,
        reason: reason || null,
        status: "open",
      })
      .select()
      .single()

    if (escalationError) {
      console.error("Error creating escalation:", escalationError)
      return NextResponse.json(
        { error: "Failed to create escalation" },
        { status: 500 },
      )
    }

    const { error: updateError } = await supabaseAdmin
      .from("sessions")
      .update({
        status: "escalated",
        ended_at: new Date().toISOString(),
      })
      .eq("id", session.id)

    if (updateError) {
      console.error("Error updating session status to escalated:", updateError)
    }

    let studentEmail: string | undefined
    let studentName: string | undefined
    let facilitatorEmail: string | undefined
    let facilitatorName: string | undefined
    try {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
        session.student_id,
      )
      studentEmail = userData?.user?.email ?? undefined
    } catch (err) {
      console.warn("Failed to load student email:", err)
    }

    try {
      const { data: studentProfile } = await supabaseAdmin
        .from("profiles")
        .select("first_name, last_name, full_name")
        .eq("id", session.student_id)
        .single()

      if (studentProfile) {
        studentName =
          (studentProfile.full_name as string | undefined) ||
          [studentProfile.first_name, studentProfile.last_name]
            .filter(Boolean)
            .join(" ") ||
          undefined
      }
    } catch (err) {
      console.warn("Failed to load student profile:", err)
    }

    if (assistant.created_by) {
      try {
        const { data: facilitatorUser } = await supabaseAdmin.auth.admin.getUserById(
          assistant.created_by,
        )
        facilitatorEmail = facilitatorUser?.user?.email ?? undefined
      } catch (err) {
        console.warn("Failed to load facilitator email:", err)
      }

      try {
        const { data: facilitatorProfile } = await supabaseAdmin
          .from("profiles")
          .select("first_name, last_name, full_name")
          .eq("id", assistant.created_by)
          .single()

        if (facilitatorProfile) {
          facilitatorName =
            (facilitatorProfile.full_name as string | undefined) ||
            [facilitatorProfile.first_name, facilitatorProfile.last_name]
              .filter(Boolean)
              .join(" ") ||
            undefined
        }
      } catch (err) {
        console.warn("Failed to load facilitator profile:", err)
      }
    }

    if (facilitatorEmail) {
      sendEscalationEmail({
        facilitatorEmail,
        studentEmail,
        studentName,
        facilitatorName,
        assistantName: assistant.name,
        courseCode: assistant.course_code,
        reason,
      }).catch((err) => {
        console.warn("Failed to send escalation email:", err)
      })
    }

    return NextResponse.json({ escalation }, { status: 200 })
  } catch (error) {
    console.error("Unexpected error creating escalation:", error)
    return NextResponse.json(
      { error: "Unexpected error while creating escalation" },
      { status: 500 },
    )
  }
}
