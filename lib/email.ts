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
  studentName?: string
  facilitatorName?: string
  courseCode?: string
  assistantName?: string
  reason?: string | null
}) {
  if (!resend || !RESEND_FROM_EMAIL) return

  const facilitatorEmail = params.facilitatorEmail
  if (!facilitatorEmail) return

  const subjectCourse = params.courseCode ? ` [${params.courseCode}]` : ""
  const subject = `ClassMate Escalation${subjectCourse}`

  const facilitatorDisplayName = params.facilitatorName || "Facilitator"
  const studentDisplayName = params.studentName || "Student"

  const bodyLines = [
    `Hi ${facilitatorDisplayName},`,
    "",
    "A student has escalated a question in ClassMate.",
    params.assistantName && params.courseCode
      ? `Assistant: ${params.assistantName} (${params.courseCode})`
      : undefined,
    `Student: ${studentDisplayName}${params.studentEmail ? ` <${params.studentEmail}>` : ""}`,
    params.reason ? `Reason: ${params.reason}` : "Reason: (not provided)",
    "",
    "You can review this escalation in your ClassMate dashboard and follow up with the student.",
  ].filter(Boolean)

  await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: facilitatorEmail,
    reply_to: params.studentEmail,
    subject,
    text: bodyLines.join("\n"),
  })
}
