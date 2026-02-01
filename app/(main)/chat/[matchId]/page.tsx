"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, Send, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

import { useChatMessages, useGenerateInsight, useSendMessage } from '@/hooks/use-chat'
import { useMatch } from '@/hooks/use-matches'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

const ChatPage = () => {
    const params = useParams()
    const matchId = params.matchId as string
    const router = useRouter()
    const { user } = useUser()
    const scrollRef = useRef<HTMLDivElement>(null)

    const { data: match, isLoading: isMatchLoading, error } = useMatch(matchId)
    const { data: messages, isLoading: isChatLoading } = useChatMessages(matchId)
    const { mutate: sendMessage, isPending: isSending } = useSendMessage(matchId)
    const { mutate: generateInsight, isPending: isGenerating, data: insight } = useGenerateInsight(matchId)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const [newMessage, setNewMessage] = useState("")

    useEffect(() => {
        if (!isMatchLoading && (!match || error)) {
            router.push('/chat')
        }
    }, [match, isMatchLoading, error, router])

    const handleSendMessage = () => {
        if (!newMessage.trim() || isSending) return
        sendMessage(newMessage, {
            onSuccess: () => setNewMessage("")
        })
    }

    if (isMatchLoading || !user) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>
    }

    if (!match) return null;



    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-4 p-4 max-w-7xl mx-auto">
            {/* Left Column: Chat Area */}
            <Card className="flex-1 flex flex-col h-full border-none shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 py-3 border-b">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href="/chat">
                            <ArrowLeft className="size-5" />
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                            <AvatarImage src={match.partner.imageUrl || ""} />
                            <AvatarFallback>{match.partner.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base">{match.partner.name}</CardTitle>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="size-2 bg-green-500 rounded-full inline-block" />
                                Online
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0 min-h-0 bg-muted/5">
                    {/* Messages Scroll Area */}
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {/* @ts-ignore */}
                            {isChatLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="animate-spin text-muted-foreground" />
                                </div>
                            ) : messages?.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-10">No messages yet. Say hello!</p>
                            ) : messages?.map((msg) => (
                                <div
                                    key={msg.id}
                                    // @ts-ignore
                                    className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        // @ts-ignore
                                        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${msg.isMine
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-muted rounded-bl-none'
                                            }`}
                                    >
                                        <p>{msg.content}</p>
                                        <span className={`text-[10px] opacity-70 block text-right mt-1 ${
                                            // @ts-ignore
                                            msg.isMine ? 'text-primary-foreground/80' : 'text-muted-foreground'
                                            }`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-4 bg-background border-t">
                        <form
                            className="flex gap-2"
                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                        >
                            <Input
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="rounded-full shadow-sm bg-muted/20 border-muted"
                            />
                            <Button type="submit" size="icon" className="rounded-full shrink-0 shadow-sm" disabled={!newMessage.trim() || isSending}>
                                {isSending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>

            {/* Right Column: AI Summary */}
            <Card className="w-full md:w-[350px] lg:w-[400px] flex flex-col h-full border-none shadow-md bg-card/50 backdrop-blur-sm">
                <CardHeader className="py-4 border-b bg-muted/20">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Sparkles className="size-4 text-purple-500 fill-purple-500/20" />
                            Conversation Insight
                        </CardTitle>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1.5 rounded-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                            onClick={() => generateInsight()}
                            disabled={isGenerating}
                        >
                            {isGenerating ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
                            Generate
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden relative">
                    {/* Placeholder for no summary */}
                    {!insight ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-muted-foreground space-y-2 opacity-60">
                            <div className="bg-muted p-3 rounded-full mb-2">
                                <Sparkles className="size-6 text-muted-foreground/50" />
                            </div>
                            <p className="font-medium text-sm">No summary generated yet</p>
                            <p className="text-xs max-w-[200px]">Click generate to get AI-powered insights, action items, and key takeaways from your chat.</p>
                        </div>
                    ) : (
                        <ScrollArea className="h-full">
                            <div className="p-4 space-y-6">
                                {/* Summary */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Summary</h4>
                                    <p className="text-sm leading-relaxed text-foreground/90 bg-muted/30 p-3 rounded-lg border">
                                        {/* @ts-ignore */}
                                        {insight.summary}
                                    </p>
                                </div>

                                {/* Topics */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Topics</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {/* @ts-ignore */}
                                        {insight.topics?.map((topic, i) => (
                                            <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Items */}
                                <div className="space-y-2">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Next Steps</h4>
                                    <ul className="space-y-2">
                                        {/* @ts-ignore */}
                                        {insight.actionItems?.map((item, i) => (
                                            <li key={i} className="text-sm flex gap-2 items-start text-foreground/80 bg-green-50/50 p-2 rounded-md border border-green-100/50">
                                                <span className="mt-1 size-1.5 rounded-full bg-green-500 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ChatPage
