import { client } from "@/lib/client-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePendingMatches = () => {
    return useQuery({
        queryKey: ["matches", "pending"],
        queryFn: async () => {
            const res = await client.api.matches.pending.$get();
            if (!res.ok) {
                throw new Error("Failed to fetch pending matches");
            }
            return res.json();
        }
    });
};

export const useActiveMatches = () => {
    return useQuery({
        queryKey: ["matches", "active"],
        queryFn: async () => {
            const res = await client.api.matches.active.$get();
            if (!res.ok) {
                throw new Error("Failed to fetch active matches");
            }
            return res.json();
        }
    });
};

export const useAcceptMatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (matchId: string) => {
            const res = await client.api.matches[":matchId"].accept.$post({
                param: { matchId }
            });
            if (!res.ok) {
                throw new Error("Failed to accept match");
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success("Match accepted!");
            queryClient.invalidateQueries({ queryKey: ["matches"] });
        },
        onError: () => {
            toast.error("Failed to accept match");
        }
    });
};

export const useMatch = (matchId: string) => {
    return useQuery({
        queryKey: ["match", matchId],
        queryFn: async () => {
            const res = await client.api.matches[":matchId"].$get({
                param: { matchId }
            })
            if (!res.ok) throw new Error("Failed to fetch match")
            return await res.json()
        },
        enabled: !!matchId
    })
}
