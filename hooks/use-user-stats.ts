
import { client } from "@/lib/client-api";
import { useQuery } from "@tanstack/react-query";

export const useUserStats = () => {
    return useQuery({
        queryKey: ["user", "stats"],
        queryFn: async () => {
            const res = await client.api.user.stats.$get();
            if (!res.ok) throw new Error("Failed to fetch user stats");
            return res.json();
        }
    })
}
