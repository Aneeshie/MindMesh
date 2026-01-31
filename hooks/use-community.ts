import { client } from "@/lib/client-api"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export type CommunityGoal = {
  id: string
  title: string
  description: string | null
  isCompleted: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

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
  return useQuery<CommunityGoal[]>({
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

export const useCreateGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ communityId, title, description }: { communityId: string, title: string, description?: string }) => {
      const res = await client.api.communities[":communityId"].goals.$post({
        param: { communityId },
        json: { title, description }
      })
      if (!res.ok) {
        throw new Error("Failed to create goal")
      }
      return (await res.json()) as CommunityGoal
    },
    onSuccess: (_, variables) => {
      toast.success("Goal created successfully")
      queryClient.invalidateQueries({ queryKey: ["communityGoals", variables.communityId] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}

export const useUpdateGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ communityId, goalId, isCompleted }: { communityId: string, goalId: string, isCompleted: boolean }) => {
      const res = await client.api.communities[":communityId"].goals[":goalId"].$patch({
        param: { communityId, goalId },
        json: { isCompleted }
      })
      if (!res.ok) {
        throw new Error("Failed to update goal")
      }
      return (await res.json()) as CommunityGoal
    },
    onSuccess: (_, variables) => {
      toast.success(variables.isCompleted ? "Goal completed! 🎉" : "Goal marked as incomplete")
      queryClient.invalidateQueries({ queryKey: ["communityGoals", variables.communityId] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
}