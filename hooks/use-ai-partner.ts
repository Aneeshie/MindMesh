import { client } from "@/lib/client-api";
import { useMutation, useQueryClient } from "@tanstack/react-query"


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
            if (!res.ok) {
                throw new Error("Failed to match users")
            }

            return res.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["potentialPartners", variables],
            })
        },
        onError: (error) => {
            console.error("Error finding ai partner aiPartner", error)
        }

    })
}