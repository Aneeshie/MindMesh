import { client } from "@/lib/client-api"
import { useQuery } from "@tanstack/react-query"


export const useCommunites = () => {


  return useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const res = await client.api.communities.$get()
      if (!res.ok) {
        throw new Error("Failed to fetch communities")
      }
      return res.json()
    }
  })


}