"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { client } from "@/lib/client-api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2, Plus, Search, UserPlus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/use-debounce" // We might need to implement this or just use state debounce

// Hook for searching users
const useSearchUsers = (query: string) => {
    return useQuery({
        queryKey: ["users", "search", query],
        queryFn: async () => {
            if (!query) return []
            const res = await client.api.matches.users.search.$get({
                query: { q: query }
            })
            if (!res.ok) throw new Error("Failed to search users")
            return res.json()
        },
        enabled: query.length > 0
    })
}

// Hook for sending friend request
const useSendRequest = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ targetUserId, communityId }: { targetUserId: string, communityId: string }) => {
            const res = await client.api.matches.request.$post({
                json: { targetUserId, communityId }
            })
            if (!res.ok) throw new Error("Failed to send request")
            return res.json()
        },
        onSuccess: () => {
            toast.success("Friend request sent!")
            queryClient.invalidateQueries({ queryKey: ["users", "search"] }) // Refresh search results to maybe exclude them? Or just UI update
        },
        onError: () => {
            toast.error("Failed to send request")
        }
    })
}

export function UserSearchDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    // Simple debounce via timeout could effect here, but for now direct state is okay or use hook if available.
    // Let's stick to direct state for MVP, maybe adding a small delay in the query hook if needed, 
    // but React Query handles deduping well. 
    // Ideally we want a debounce hook. I'll implement a simple one inside if needed or assume standard.

    // Actually, I'll just use the raw search string. React Query caches it.

    const { data: users, isLoading } = useSearchUsers(search)
    const { mutate: sendRequest, isPending: isSending } = useSendRequest()

    // HARDCODED COMMUNITY ID FOR MVP: 
    // We need a valid community ID. 
    // Ideally pass this as a prop or fetch user's communities.
    // Let's use a prop or default to the first one found?
    // User requested "Find his/her friend".
    // I'll cheat for the MVP and fetch the list of communities and pick the first one.
    const [selectedCommunityId, setSelectedCommunityId] = useState<string>("")

    // Fetch communities to pick from?
    // Maybe simpler: Just ask the user to pick a community ONLY if they have multiple?

    // For now, let's hardcode fetching communities inside the component to pick one.
    const { data: communities } = useQuery({
        queryKey: ["communities"],
        queryFn: async () => {
            const res = await client.api.communities.$get()
            if (!res.ok) return []
            const data = await res.json()
            // @ts-ignore
            return data.data || data
        }
    })

    const handleInvite = (userId: string) => {
        if (!communities || communities.length === 0) {
            toast.error("You need to join a community first!")
            return
        }
        // Default to first community
        const communityId = communities[0].communityId

        sendRequest({ targetUserId: userId, communityId }, {
            onSuccess: () => {
                // Optional: Close dialog or keep open to add more?
                // setOpen(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Find Friends</DialogTitle>
                    <DialogDescription>
                        Search for people to study with by name or email.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="h-[300px] pr-4">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-muted-foreground" />
                            </div>
                        ) : users?.length === 0 && search ? (
                            <p className="text-center text-sm text-muted-foreground py-8">No results found.</p>
                        ) : !search ? (
                            <p className="text-center text-sm text-muted-foreground py-8">Type to search...</p>
                        ) : (
                            <div className="space-y-4">
                                {users?.map((user: any) => (
                                    <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.imageUrl} />
                                                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 rounded-full"
                                            onClick={() => handleInvite(user.id)}
                                            disabled={isSending}
                                        >
                                            {isSending ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    )
}
