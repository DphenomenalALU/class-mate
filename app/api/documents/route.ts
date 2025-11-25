import { NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { createTavusDocument } from "@/lib/tavus"

const BUCKET = "course-materials"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const assistantId = body?.assistantId as string | undefined
    const path = body?.path as string | undefined
    const documentName = body?.documentName as string | undefined

    if (!assistantId || !path || !documentName) {
      return NextResponse.json(
        { error: "assistantId, path and documentName are required" },
        { status: 400 },
      )
    }

    // Build a public URL for the uploaded file
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(path)

    const publicUrl = publicUrlData.publicUrl

    if (!publicUrl) {
      return NextResponse.json(
        { error: "Could not create public URL for document" },
        { status: 500 },
      )
    }

    // Create Tavus knowledge base document
    const tavusDoc = await createTavusDocument({
      documentName,
      documentUrl: publicUrl,
      tags: [assistantId],
    })

    // Store mapping in assistant_documents
    const { data, error } = await supabaseAdmin
      .from("assistant_documents")
      .insert({
        assistant_id: assistantId,
        tavus_document_id: tavusDoc.document_id,
        document_name: documentName,
        document_url: publicUrl,
        tags: [assistantId],
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting assistant_document:", error)
      return NextResponse.json(
        { error: "Failed to save document metadata" },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { document: data, tavus: tavusDoc },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error creating Tavus document:", error)
    return NextResponse.json(
      { error: "Failed to create Tavus document" },
      { status: 500 },
    )
  }
}

