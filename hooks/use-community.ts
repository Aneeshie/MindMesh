import { client } from "@/lib/client-api"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"


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

export const useCommunityGoals = (communityId: string) => {
  return useQuery({
    queryKey: ["communityGoals", communityId],
    queryFn: async () => {
      const res = await client.api.communities[":communityId"].goals.$get({
        param: { communityId }
      });
      if (!res.ok) {
        throw new Error("Failed to fetch community Goals");
      }
      return res.json();
    },
    enabled: !!communityId
  })
}

export const useAllCommunities = (search: string = "") => {
  return useInfiniteQuery({
    queryKey: ["all-communities", search],
    queryFn: async ({ pageParam }) => {
      const res = await client.api.communities.all.$get({
        query: {
          q: search,
          limit: "10",
          offset: pageParam ? pageParam.toString() : "0"
        }
      })
      if (!res.ok) {
        throw new Error("Failed to fetch all communities")
      }
      return res.json()
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  })
}

export const useJoinCommunity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (communityId: string) => {
      const res = await client.api.communities[":communityId"].join.$post({
        param: { communityId }
      })
      if (!res.ok) {
        throw new Error("Failed to join community")
      }
      return res.json()
    },
    onSuccess: () => {
      toast.success("Joined community successfully")
      queryClient.invalidateQueries({ queryKey: ["communities"] })
      queryClient.invalidateQueries({ queryKey: ["all-communities"] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}