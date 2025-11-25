import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("session_queue_local")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Queue status error:", error)
      return NextResponse.json(
        { error: "Failed to fetch queue status" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: data.status,
      position: data.position,
    })
  } catch (error) {
    console.error("Queue status unexpected error:", error)
    return NextResponse.json(
      { error: "Unexpected error while fetching queue status" },
      { status: 500 }
    )
  }
}

