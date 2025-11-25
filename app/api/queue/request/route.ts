import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const assistantId =
      body?.assistantId || process.env.DEFAULT_ASSISTANT_ID
    const studentClientId = body?.studentClientId as string | undefined

    if (!assistantId || !studentClientId) {
      return NextResponse.json(
        { error: "assistantId and studentClientId are required" },
        { status: 400 }
      )
    }

    const { error: healthError } = await supabaseAdmin
      .from("session_queue_local")
      .select("id")
      .limit(1)
    if (healthError && healthError.code === "42P01") {
      return NextResponse.json(
        {
          error:
            "session_queue_local table not found. Please add it to Supabase (see supabase-schema.sql).",
        },
        { status: 500 }
      )
    }

    const { data: existing, error } = await supabaseAdmin
      .from("session_queue_local")
      .select("*")
      .eq("assistant_id", assistantId)
      .in("status", ["waiting", "active"])
      .order("position", { ascending: true })

    if (error) {
      console.error("Queue fetch error:", error)
      return NextResponse.json(
        { error: "Failed to read queue" },
        { status: 500 }
      )
    }

    const activeEntry = existing?.find((row) => row.status === "active")
    const waitingEntries = existing?.filter(
      (row) => row.status === "waiting"
    ) ?? []

    const existingForStudent = existing?.find(
      (row) => row.student_client_id === studentClientId
    )

    if (existingForStudent && existingForStudent.status === "active") {
      return NextResponse.json({
        status: "active",
        position: existingForStudent.position,
        queueId: existingForStudent.id,
      })
    }

    if (!activeEntry) {
      const position = 1

      if (existingForStudent) {
        const { data: updated, error: updateError } = await supabaseAdmin
          .from("session_queue_local")
          .update({ status: "active", position })
          .eq("id", existingForStudent.id)
          .select()
          .single()

        if (updateError) {
          console.error("Queue update error:", updateError)
          return NextResponse.json(
            { error: "Failed to update queue" },
            { status: 500 }
          )
        }

        return NextResponse.json({
          status: "active",
          position: updated.position,
          queueId: updated.id,
        })
      }

      const { data: inserted, error: insertError } = await supabaseAdmin
        .from("session_queue_local")
        .insert({
          assistant_id: assistantId,
          student_client_id: studentClientId,
          status: "active",
          position,
        })
        .select()
        .single()

      if (insertError) {
        console.error("Queue insert error:", insertError)
        return NextResponse.json(
          { error: "Failed to join queue" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        status: "active",
        position: inserted.position,
        queueId: inserted.id,
      })
    }

    const maxPosition =
      waitingEntries.length > 0
        ? waitingEntries[waitingEntries.length - 1].position
        : activeEntry.position
    const position = maxPosition + 1

    if (existingForStudent) {
      const { data: updated, error: updateError } = await supabaseAdmin
        .from("session_queue_local")
        .update({ status: "waiting", position })
        .eq("id", existingForStudent.id)
        .select()
        .single()

      if (updateError) {
        console.error("Queue update error:", updateError)
        return NextResponse.json(
          { error: "Failed to update queue" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        status: "queued",
        position: updated.position,
        queueId: updated.id,
      })
    }

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("session_queue_local")
      .insert({
        assistant_id: assistantId,
        student_client_id: studentClientId,
        status: "waiting",
        position,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Queue insert error:", insertError)
      return NextResponse.json(
        { error: "Failed to join queue" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: "queued",
      position: inserted.position,
      queueId: inserted.id,
    })
  } catch (error) {
    console.error("Queue request error:", error)
    return NextResponse.json(
      { error: "Unexpected error while joining queue" },
      { status: 500 }
    )
  }
}

