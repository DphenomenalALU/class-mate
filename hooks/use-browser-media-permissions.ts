"use client"

export function useBrowserMediaPermissions() {
  async function requestPermissions() {
    try {
      if (!navigator?.mediaDevices?.getUserMedia) return
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    } catch (error) {
      console.error("Error requesting media permissions:", error)
    }
  }

  return { requestPermissions }
}

