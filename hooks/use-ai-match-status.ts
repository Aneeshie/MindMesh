import { client } from "@/lib/client-api"
import { useQuery } from "@tanstack/react-query"

export type AiMatchStatus = {
  isPro: boolean
  limit: number
  used: number
  remaining: number | null
}

export const AI_MATCH_STATUS_QUERY_KEY = ["aiMatchStatus"]

export const useAiMatchStatus = () => {
  return useQuery<AiMatchStatus>({
    queryKey: AI_MATCH_STATUS_QUERY_KEY,
    queryFn: async () => {
      const res = await client.api.matches.aiMatch.status.$get()
      if (!res.ok) {
        throw new Error("Failed to fetch AI match status")
      }
      return (await res.json()) as AiMatchStatus
    },
  })
}

