import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const queueId = body?.queueId as string | undefined

    if (!queueId) {
      return NextResponse.json(
        { error: "queueId is required" },
        { status: 400 }
      )
    }

    const { data: current, error: currentError } = await supabaseAdmin
      .from("session_queue_local")
      .select("*")
      .eq("id", queueId)
      .single()

    if (currentError || !current) {
      console.error("Queue complete fetch error:", currentError)
      return NextResponse.json(
        { error: "Queue entry not found" },
        { status: 404 }
      )
    }

    const { error: updateError } = await supabaseAdmin
      .from("session_queue_local")
      .update({ status: "completed" })
      .eq("id", queueId)

    if (updateError) {
      console.error("Queue complete update error:", updateError)
      return NextResponse.json(
        { error: "Failed to complete session" },
        { status: 500 }
      )
    }

    const { data: waiting, error: waitingError } = await supabaseAdmin
      .from("session_queue_local")
      .select("*")
      .eq("assistant_id", current.assistant_id)
      .eq("status", "waiting")
      .order("position", { ascending: true })
      .limit(1)

    if (waitingError) {
      console.error("Queue complete waiting error:", waitingError)
      return NextResponse.json(
        { error: "Failed to promote next student" },
        { status: 500 }
      )
    }

    let promoted: { id: string; position: number } | null = null

    if (waiting && waiting.length > 0) {
      const next = waiting[0]
      const { data: updated, error: promoteError } = await supabaseAdmin
        .from("session_queue_local")
        .update({ status: "active" })
        .eq("id", next.id)
        .select()
        .single()

      if (promoteError) {
        console.error("Queue promote error:", promoteError)
        return NextResponse.json(
          { error: "Failed to promote next student" },
          { status: 500 }
        )
      }

      promoted = { id: updated.id, position: updated.position }
    }

    return NextResponse.json({ promoted })
  } catch (error) {
    console.error("Queue complete unexpected error:", error)
    return NextResponse.json(
      { error: "Unexpected error while completing session" },
      { status: 500 }
    )
  }
}

