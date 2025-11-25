"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "classmate_student_id"

export function useStudentId() {
  const [studentId, setStudentId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    let id = window.localStorage.getItem(STORAGE_KEY)
    if (!id) {
      id = crypto.randomUUID()
      window.localStorage.setItem(STORAGE_KEY, id)
    }
    setStudentId(id)
  }, [])

  return studentId
}

