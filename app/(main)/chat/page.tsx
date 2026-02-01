"use client"

import { useAcceptMatch, useActiveMatches, usePendingMatches } from '@/hooks/use-matches'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserSearchDialog } from '@/components/user-search-dialog'

import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ArrowLeft, Loader2, Send, Phone, Video, MoreVertical, Search, CheckCheck, Users, UserPlus, Target, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'

const ChatPage = () => {
    const { data: pendingMatches, isLoading: isPendingLoading } = usePendingMatches()
    const { data: activeMatches, isLoading: isActiveLoading } = useActiveMatches()
    const { mutate: acceptMatch, isPending: isAccepting } = useAcceptMatch()



    return (
        <div className='page-wrapper max-w-7xl mx-auto space-y-8 px-4 sm:px-6 py-8'>
            <div className="space-y-2">
                <h1 className='text-3xl font-bold tracking-tight'>Matches & Chats</h1>
                <p className="text-muted-foreground">Manage your learning partners and conversations.</p>
            </div>

            {/* Pending Matches Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className='text-xl font-semibold flex items-center gap-2'>
                        Pending Matches
                        {pendingMatches?.length ? (
                            <Badge variant="secondary" className="rounded-full">{pendingMatches.length}</Badge>
                        ) : null}
                    </h2>
                    <UserSearchDialog>
                        <Button variant="outline" size="sm" className="gap-2">
                            <UserPlus className="size-4" />
                            Find Friends
                        </Button>
                    </UserSearchDialog>
                </div>

                {isPendingLoading ? (
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="w-[300px] h-[350px] shrink-0 animate-pulse bg-muted/50 border-none" />
                        ))}
                    </div>
                ) : pendingMatches?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-muted/5 text-center">
                        <UserPlus className="size-10 text-muted-foreground mb-3" />
                        <p className="font-medium">No pending matches</p>
                        <p className="text-sm text-muted-foreground">Find partners in your communities to start matching.</p>
                    </div>
                ) : (
                    <ScrollArea className="w-full whitespace-nowrap pb-4">
                        <div className="flex gap-4">
                            {/* @ts-ignore */}
                            {pendingMatches?.map((match) => (
                                <Card key={match.match.id} className="w-[320px] shrink-0 flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3 text-center items-center space-y-3">
                                        <div className="relative">
                                            <Avatar className="size-20 border-4 border-background shadow-sm">
                                                <AvatarImage src={match.partner.imageUrl || ""} />
                                                <AvatarFallback className="text-lg">{match.partner.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] p-1 px-2 rounded-full border-2 border-background shadow-sm font-medium">
                                                {match.community?.name || "DM"}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg">{match.partner.name}</CardTitle>
                                            <CardDescription className="line-clamp-1">
                                                Matched {formatDistanceToNow(new Date(match.match.createdAt), { addSuffix: true })}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pb-3">
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Learning Goals</p>
                                            <div className="flex flex-wrap gap-1.5 min-h-[50px] content-start whitespace-normal">
                                                {match.partnerGoals.slice(0, 3).map((goal) => (
                                                    <Badge key={goal.id} variant="outline" className="bg-muted/10">
                                                        {goal.title}
                                                    </Badge>
                                                ))}
                                                {match.partnerGoals.length > 3 && (
                                                    <Badge variant="outline" className="text-muted-foreground">+{match.partnerGoals.length - 3}</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-2 pb-6">
                                        <Button
                                            className="w-full rounded-full shadow-sm"
                                            onClick={() => acceptMatch(match.match.id)}
                                            disabled={isAccepting}
                                        >
                                            {isAccepting ? <Loader2 className="size-4 animate-spin mr-2" /> : <CheckCheck className="size-4 mr-2" />}
                                            Accept & Start Chatting
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                )}
            </div>

            {/* Active Chats Section */}
            <div className="space-y-4">
                <h2 className='text-xl font-semibold flex items-center gap-2'>Active Chats</h2>

                {isActiveLoading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <Card key={i} className="h-32 w-full animate-pulse bg-muted/50 border-none" />
                        ))}
                    </div>
                ) : activeMatches?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border rounded-xl bg-card text-center">
                        <MessageSquare className="size-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium">No active chats yet</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                            Accept pending matches to start conversations with your study partners.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {/* @ts-ignore */}
                        {activeMatches?.map((active) => (
                            <Card key={active.match.id} className="group hover:border-primary/50 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                                    {/* Partner Info */}
                                    <div className="flex items-center gap-4 min-w-[200px]">
                                        <Avatar className="size-16 border-2 border-muted">
                                            <AvatarImage src={active.partner.imageUrl || ""} />
                                            <AvatarFallback className="text-lg">{active.partner.name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-lg">{active.partner.name}</h3>
                                            {active.community ? (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                                                    <Users className="size-4" />
                                                    <span>Matched in <strong>{active.community.name}</strong></span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                                                    <UserPlus className="size-4" />
                                                    <span>Direct Match</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Goals Comparison */}
                                    <div className="flex-1 grid md:grid-cols-2 gap-6 bg-muted/30 p-4 rounded-xl">
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase">Their Goals</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {active.partnerGoals.slice(0, 2).map((goal) => (
                                                    <Badge key={goal.id} variant="secondary" className="bg-background">
                                                        {goal.title}
                                                    </Badge>
                                                ))}
                                                {active.partnerGoals.length > 2 && (
                                                    <span className="text-xs text-muted-foreground self-center">+{active.partnerGoals.length - 2} more</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase text-primary/80">My Goals</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {active.myGoals.slice(0, 2).map((goal) => (
                                                    <Badge key={goal.id} variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                                                        {goal.title}
                                                    </Badge>
                                                ))}
                                                {active.myGoals.length > 2 && (
                                                    <span className="text-xs text-muted-foreground self-center">+{active.myGoals.length - 2} more</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col justify-center min-w-[120px]">
                                        <Button size="lg" className="w-full" asChild>
                                            <Link href={`/chat/${active.match.id}`}>
                                                Chat
                                                <MessageSquare className="size-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div >
    )
}

export default ChatPage