import { client } from "@/lib/client-api";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AI_MATCH_STATUS_QUERY_KEY } from "./use-ai-match-status";


export const useAIPartners = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            communityId,
        }: {
            communityId: string;
        }) => {
            const res =
                (await client.api.matches[":communityId"].aiMatch.$post({
                    param: {
                        communityId
                    }
                }))
            const data = await res.json().catch(() => null) as { error?: string } | null;
            if (!res.ok) {
                throw new Error(data?.error ?? "Failed to match users")
            }

            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["potentialPartners", variables],
            })
            queryClient.invalidateQueries({
                queryKey: AI_MATCH_STATUS_QUERY_KEY,
            })
        },
        onError: (error: unknown) => {
            console.error("Error finding ai partner aiPartner", error)
        }

    })
}