import { useEffect, useState } from "react"
import liff from "@line/liff"
import { toast } from "react-toastify"

export function useLiffUser() {
  const [userId, setUserId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const liffId = import.meta.env.VITE_LIFF_ID
    if (!liffId) {
      const err = new Error("LIFF ID is not defined. Please set VITE_LIFF_ID in your .env file.")
      toast.error(err.message)
      setError(err)
      return
    }

    const params = new URLSearchParams(window.location.search)
    const isInitDone = params.get("init-done") === "true"

    liff.init({ liffId })
      .then(() => liff.ready)
      .then(async () => {
        if (!liff.isLoggedIn()) {
          if (!isInitDone) {
            liff.login({
              redirectUri: "https://kabukachi-dock-c284d.web.app/?init-done=true",
            })
            return
          }

          setIsInitialized(true)
          return
        }

        try {
          const profile = await liff.getProfile()
          setUserId(profile.userId)
          localStorage.setItem("userId", profile.userId)
        } catch (err: any) {
          console.error("Get profile failed", err)
          toast.error(`Get profile failed: ${err}`)
          setError(err)
        }

        setIsInitialized(true)
      })
      .catch((err) => {
        console.error("LIFF init/ready failed", err)
        toast.error(`LIFF failed: ${err}`, { autoClose: false })
        setError(err)
      })
  }, [])

  return { userId, isInitialized, error }
}
