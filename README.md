# ClassMate 🎓

ClassMate is an AI‑powered academic assistant for distributed learning environments (like ALU). It lets students talk to human‑like video tutors in real time, while facilitators control the knowledge base, prompts, and escalation workflows from a simple dashboard.

The app is built with **Next.js App Router**, **Tavus CVI**, **Supabase**, and **Resend**.

---

## Features

- **Student Experience**
  - Google sign‑in (student / facilitator role selection).
  - Zoom‑style live video sessions with Tavus CVI.
  - Mic + camera on/off controls wired to Daily/Tavus.
  - One‑at‑a‑time assistant queue with a live “queue position” screen.
  - Escalation flow:
    - Student can escalate with a short note.
    - LLM can suggest escalation via tool‑calling (`trigger_escalation`), pre‑filling the note.
  - Post‑session rating (1–5) for each session.
  - Session history view (`/student/history`) with status and rating.

- **Facilitator Dashboard**
  - Assistants per course, each with:
    - Tavus persona + replica.
    - System prompt + context.
    - Knowledge base docs (uploaded to Supabase Storage and registered with Tavus).
    - Context notes to steer the assistant.
  - Shareable assistant links (`/assistant/[assistantId]`) for students.
  - Escalation log with status and “Mark All Reviewed”.
  - Overview analytics:
    - Total sessions.
    - Resolution rate (completed without escalation).
    - Open escalations.
    - Student satisfaction (average rating).
  - Collapsible sidebar for both student and facilitator dashboards.
  - **Settings (BYOK)**:
    - Per‑facilitator Tavus API key.
    - Per‑facilitator Resend API key + from address.
    - Existing assistants are resynced with the new Tavus key on save.

- **Help & Guides**
  - `/help` page linked from the landing header (“Guide”) with:
    - Quick start for students.
    - Quick start for facilitators.

---

## Tech Stack

- **Frontend**
  - Next.js (App Router, TypeScript, Turbopack)
  - React 19
  - Tailwind‑based UI kit (cards, buttons, selects, etc.)
  - Tavus CVI UI components (`@tavus/cvi-ui`) + Daily WebRTC

- **Backend / Data**
  - Supabase (Postgres, Auth, Storage, RLS)
  - Resend (email notifications)

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Supabase setup

Create a Supabase project and configure:

1. **Database schema**

Run these SQL files (in order) in the Supabase SQL editor:

- `supabase-schema.sql` – core tables: `profiles`, `assistants`, `assistant_documents`, `assistant_notes`, `sessions`, `session_queue`, `escalations`, etc.
- `supabase-queue-local.sql` – local session queue table (`session_queue_local`) used for “one active student per assistant”.
- `supabase-extra.sql` – additional fields and tables:
  - `assistants.system_prompt`, `assistants.context`
  - `profiles.email`, `first_name`, `last_name`
  - RLS policies for `sessions` insert/update
  - `facilitator_settings` table for BYOK (Tavus + Resend)

2. **Auth**

- Enable **Google OAuth** in Supabase Auth settings.
- Add `http://localhost:3000/login` as a redirect URL (and your production URL later).

3. **Storage**

- Create a public bucket named `course-materials`. This is used for knowledge‑base uploads that Tavus ingests.

### 3. Environment variables

Create `.env.local` (you can start from `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

TAVUS_API_KEY=your_default_tavus_api_key

RESEND_API_KEY=your_default_resend_api_key
RESEND_FROM_EMAIL=no-reply@classmate.app

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- The **default** `TAVUS_API_KEY` and `RESEND_*` values are used when a facilitator hasn’t provided their own keys yet. Facilitator‑specific overrides live in `facilitator_settings` and are configurable at `/dashboard/settings`.

### 4. Run the app

```bash
pnpm dev
```

Visit:

- `http://localhost:3000/` – landing page
- `http://localhost:3000/login` – login + role selection
- `http://localhost:3000/student` – student dashboard
- `http://localhost:3000/dashboard` – facilitator dashboard
- `http://localhost:3000/help` – help / quick start

---

## Auth & Roles

1. User signs in via Google on `/login`.
2. On first login, they choose:
   - “I am a Student”
   - “I am a Facilitator”
3. We upsert a `profiles` row with:
   - `id` = auth user id
   - `email`, `full_name`, `first_name`, `last_name`
   - `role` = `"student"` or `"facilitator"`
4. Layouts are gated:
   - Student area (`/student/**`) allows `student` and `facilitator`.
   - Dashboard (`/dashboard/**`) requires `facilitator`.

Sign out via the sidebar Sign Out button returns the user to the landing page.

---

## Assistants, Knowledge Base & Notes

### Assistants

- Managed at `/dashboard/assistants`.
- Each assistant has:
  - `course_code` (e.g., `CS101`)
  - `name` (e.g., `Intro to Programming Assistant`)
  - Tavus `persona_id` + `replica_id` (stock replicas are provided)
  - `system_prompt` + `context` seeded from the SRS (constrained to course materials, safe behaviors)
  - `created_by` (facilitator user id)

Creating an assistant also:

- Syncs the persona with Tavus (prompt, context, and LLM tool config).

### Knowledge Base (KB)

- Per‑assistant KB is managed at:
  - `/dashboard/knowledge` (global view), and
  - `/dashboard/assistants/[id]` (assistant‑specific view).
- Flow:
  1. Facilitator picks an assistant.
  2. Uploads files to Supabase Storage (`course-materials`).
  3. API (`/api/documents`) calls Tavus `POST /v2/documents` with the public URL.
  4. `assistant_documents` stores Tavus `document_id` + metadata.

During conversations, those `document_ids` are passed to Tavus when creating a conversation.

### Notes

- `assistant_notes` are per assistant.
- Managed from `/dashboard/assistants/[id]` (Context Notes card).
- Used to give the assistant additional context / announcements (can also be folded into the persona prompt over time).

---

## Live Sessions & Queue

- Students start sessions from:
  - `/student` (courses / quick connect), or
  - A shared assistant link: `/assistant/[assistantId]`.
- When they request a session:
  - `POST /api/queue/request` determines whether:
    - There is an active slot for that assistant → they go straight to `/session/[queueId]`.
    - Assistant is busy → they go to `/student/queue?queueId=...` with a position number.
- Queue implementation:
  - Uses `session_queue_local` and RLS to enforce “one active session per assistant”.
  - `/student/queue` polls `/api/queue/status` every ~10s and navigates to `/session/[queueId]` once the student becomes active.

Each live session creates a row in `sessions` with:

- `assistant_id`, `student_id`
- `status` (`active` → `completed` or `escalated`)
- `started_at`, `ended_at`
- `rating` (Phase 6)

---

## Tavus Integration & Tool Calling

- **Conversation creation** (`/api/conversations`):
  - Uses the assistant’s `tavus_persona_id`, `tavus_replica_id`, and `assistant_documents` → `document_ids`.
  - Respects facilitator‑specific Tavus key overrides (from `facilitator_settings`).

- **Persona sync** (`syncTavusPersonaForAssistant`):
  - Sets `system_prompt` and `context`.
  - Configures an LLM tool:

    ```json
    {
      "type": "function",
      "function": {
        "name": "trigger_escalation",
        "description": "Escalate when question is outside materials or about grades/attendance/etc.",
        "parameters": {
          "type": "object",
          "properties": {
            "reason": { "type": "string" }
          },
          "required": ["reason"]
        }
      }
    }
    ```

- **Tool calling in the app**:
  - The session page uses `useDaily` to listen for `app-message` events.
  - When an event corresponds to `trigger_escalation(reason)`, the client:
    - Prefills the escalation note with `reason`.
    - Opens the escalation modal so the student can review and confirm.

This satisfies the SRS requirement for LLM‑driven escalation while keeping the student in control.

---

## Escalations & Email Notifications

- Student‑triggered:
  - Yellow “Escalate” button in the session UI opens a modal.
  - Student writes an optional note.
  - Confirm:
    - `POST /api/escalations` inserts into `escalations` (`session_id`, `assistant_id`, `student_id`, `source='student'`, `reason`).
    - Session is marked `escalated` with `ended_at`.
    - Queue advances to the next student.

- LLM‑triggered:
  - When Tavus tool calls `trigger_escalation`, the same modal opens with the LLM’s reason prefilled; student still confirms.

- Emails via Resend:
  - `POST /api/escalations`:
    - Looks up facilitator (`assistants.created_by`) and their BYOK Resend settings.
    - Sends a personalized email:
      - To the facilitator, with assistant/course + reason.
      - `reply_to` set to the student’s email.

---

## Ratings & Analytics

- After a session ends, students see a 1–5 rating overlay.
- Rating is saved to `sessions.rating`.
- Overview dashboard aggregates:
  - Total sessions.
  - Resolution rate (completed vs total).
  - Open escalations + number of escalated sessions.
  - Student satisfaction (average rating, number of ratings).

This matches the SRS target of tracking resolution and satisfaction over a term.

---

## BYOK (Bring Your Own Keys)

- Facilitators can override project‑level keys in `/dashboard/settings`:
  - Tavus API key.
  - Resend API key + from email.
- When settings are saved:
  - Keys are stored in `facilitator_settings` with RLS so only the owner can manage them.
  - A background resync runs to update all of that facilitator’s assistants’ personas with the new Tavus key.
  - Future:
    - Conversations.
    - KB document registrations.
    - Escalation emails.
  all use the per‑facilitator keys where provided.

---

## Help & Documentation

- `/help` linked from the landing header as **Guide**:
  - Gives a short, friendly walkthrough for both students and facilitators.
- The SRS (`Ibrahim_Salami_[Assignment2]_[10172025].md`) is included in the repo for reference and alignment.

---

## Contributing / Next Steps

This project is structured to be easy to extend:

- Add more analytics (per‑assistant, by time of day).
- Add richer session summaries.
- Tighten persona prompts per course and expose more prompt editing in the UI.
- Improve resilience around missing/invalid BYOK settings.

For changes, follow existing patterns (App Router, supabase client usage, and RLS). PRs and improvements are welcome. 🎉

