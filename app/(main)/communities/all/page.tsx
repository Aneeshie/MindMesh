"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAllCommunities, useCommunites, useJoinCommunity } from "@/hooks/use-community"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"

const AllCommunitiesPage = () => {
    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 500)

    const {
        data: allCommunitiesData,
        isLoading: isLoadingAll,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useAllCommunities(debouncedSearch)

    const { data: userCommunities, isLoading: isLoadingUser } = useCommunites()
    const { mutate: joinCommunity, isPending: isJoining } = useJoinCommunity()

    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, fetchNextPage])

    // Flatten pages into a single array
    const allCommunities = allCommunitiesData?.pages.flatMap((page: any) => page.data) || []

    // Determine joined status and sort
    const communitiesWithStatus = allCommunities.map((community: any) => {
        const isJoined = userCommunities?.some(
            (uc) => uc.communityId === community.id
        )
        return { ...community, isJoined }
    })

    const sortedCommunities = communitiesWithStatus.sort(
        (a: any, b: any) => {
            if (a.isJoined === b.isJoined) return 0
            return a.isJoined ? 1 : -1
        }
    )

    return (
        <div className="page-wrapper space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        All Communities
                    </h1>
                    <p className="text-muted-foreground">
                        Explore and join new communities.
                    </p>
                </div>

                <Link href="/communities">
                    <Button variant="outline">
                        ← Back to Communites
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <Input
                placeholder="Search communities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
            />

            {/* Grid */}
            {(isLoadingAll || isLoadingUser) ? (
                <div className="h-40 flex items-center justify-center text-muted-foreground">Loading communities...</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sortedCommunities.map((community: any) => (
                        <Card key={community.id} className="flex flex-col">
                            <CardHeader className="flex-1">
                                <CardTitle>{community.name}</CardTitle>
                                <CardDescription>
                                    {community.description || "No description available."}
                                </CardDescription>
                            </CardHeader>

                            <div className="p-6 pt-0 mt-auto">
                                <Button
                                    className="w-full"
                                    variant={community.isJoined ? "secondary" : "default"}
                                    disabled={community.isJoined || isJoining}
                                    onClick={() => {
                                        if (!community.isJoined) {
                                            joinCommunity(community.id)
                                        }
                                    }}
                                >
                                    {community.isJoined ? "Joined" : "Join Community"}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Infinite Scroll Loader */}
            <div ref={ref} className="h-10 text-center text-sm text-muted-foreground">
                {isFetchingNextPage ? "Loading more..." : ""}
            </div>

            {!hasNextPage && sortedCommunities.length > 0 && (
                <p className="text-center text-sm text-muted-foreground">No more communities</p>
            )}
            {sortedCommunities.length === 0 && !isFetchingNextPage && (
                <p className="text-center text-muted-foreground">No communities found matching "{debouncedSearch}"</p>
            )}
        </div>
    )
}

export default AllCommunitiesPage