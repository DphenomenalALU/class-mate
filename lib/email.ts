import { Resend } from "resend"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL

let resend: Resend | null = null

if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY)
} else {
  console.warn("RESEND_API_KEY is not set. Escalation emails will not be sent.")
}

export async function sendEscalationEmail(params: {
  facilitatorEmail?: string
  studentEmail?: string
  courseCode?: string
  assistantName?: string
  reason?: string | null
}) {
  if (!resend || !RESEND_FROM_EMAIL) return

  const facilitatorEmail = params.facilitatorEmail
  if (!facilitatorEmail) return

  const subjectCourse = params.courseCode ? ` [${params.courseCode}]` : ""
  const subject = `ClassMate Escalation${subjectCourse}`

  const bodyLines = [
    params.assistantName && params.courseCode
      ? `Assistant: ${params.assistantName} (${params.courseCode})`
      : undefined,
    params.reason ? `Reason: ${params.reason}` : "Reason: (not provided)",
    "",
    "This question needs facilitator review in the ClassMate dashboard.",
  ].filter(Boolean)

  await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: facilitatorEmail,
    reply_to: params.studentEmail,
    subject,
    text: bodyLines.join("\n"),
  })
}
