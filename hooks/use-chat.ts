import { client } from "@/lib/client-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useChatMessages = (matchId: string) => {
    return useQuery({
        queryKey: ["chat", matchId],
        queryFn: async () => {
            const res = await client.api.matches[":matchId"].messages.$get({
                param: { matchId }
            });
            if (!res.ok) throw new Error("Failed to fetch messages");
            return res.json();
        },
        refetchInterval: 3000, // Poll every 3 seconds
        enabled: !!matchId
    });
};

export const useSendMessage = (matchId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (content: string) => {
            const res = await client.api.matches[":matchId"].messages.$post({
                param: { matchId },
                json: { content }
            });
            if (!res.ok) throw new Error("Failed to send message");
            return res.json();
        },
        onSuccess: () => {
            // Immediately refetch messages to show the new one
            queryClient.invalidateQueries({ queryKey: ["chat", matchId] });
        },
        onError: () => {
            toast.error("Failed to send message");
        }
    });
};

export const useGenerateInsight = (matchId: string) => {
    return useMutation({
        mutationFn: async () => {
            const res = await client.api.matches[":matchId"].insight.$post({
                param: { matchId }
            });
            if (!res.ok) throw new Error("Failed to generate insight");
            return res.json();
        },
        onError: () => {
            toast.error("Failed to generate insight");
        }
    })
}
