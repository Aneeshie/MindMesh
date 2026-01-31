"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AiMatching } from "@/components/communities/ai-matching"
import { useCommunites, useCommunityGoals } from "@/hooks/use-community"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Hash, Users, BookOpen, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type Goal = {
  id: string
  title: string
  description: string | null
}

const CommunitiesPage = () => {
  const { data, isLoading, error } = useCommunites()

  const [selectedCommunity, setSelectedCommunity] =
    useState<string | "">("")

  const {
    data: goals = [],
    isLoading: isLoadingGoals,
    error: errorGoals,
  } = useCommunityGoals(selectedCommunity || "")

  useEffect(() => {
    if (data?.length && !selectedCommunity) {
      setSelectedCommunity(data[0].community.id)
    }
  }, [data, selectedCommunity])

  const addGoal = () => {
    console.log("Add goal clicked - pending backend implementation")
  }

  if (isLoading) {
    return (
      <div className="page-wrapper h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse text-sm font-medium">
            Loading your spaces...
          </p>
        </div>
      </div>
    )
  }

  if (error instanceof Error) {
    return (
      <div className="page-wrapper">
        <div className="p-6 border border-destructive/20 rounded-xl bg-destructive/5 text-destructive flex flex-col gap-2 items-center text-center">
          <div className="size-10 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <span className="text-xl">!</span>
          </div>
          <h3 className="font-semibold">Something went wrong</h3>
          <p className="text-sm opacity-90">{error.message}</p>
        </div>
      </div>
    )
  }

  const hasCommunities = data && data.length > 0
  const currentCommunity = data?.find(
    (c) => c.community.id === selectedCommunity
  )?.community

  return (
    <div className="page-wrapper max-w-7xl mx-auto space-y-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-end justify-between border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Communities
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Your hub for collaborative learning and growth.
          </p>
        </div>

        <Link href={"/communities/all"}>
          <Button className="rounded-full px-6 shadow-sm hover:shadow-md transition-all">
            <Plus className="size-4 mr-2" />
            Explore
          </Button>
        </Link>
      </div>

      {!hasCommunities ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-3xl border-2 border-dashed border-muted">
          <div className="bg-background p-6 rounded-full shadow-sm mb-6">
            <Users className="size-10 text-primary/80" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-3">
            No Communities Yet
          </h2>
          <p className="text-muted-foreground max-w-md text-lg mb-8 leading-relaxed">
            Join a community to connect with peers, find study partners, and
            accelerate your learning journey.
          </p>
          <Link href="/communities/all">
            <Button size="lg" className="rounded-full px-8 h-12 text-base">
              Find a Community
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* SIDEBAR */}
          <div
            className="
              hidden lg:block lg:col-span-3 sticky top-6 space-y-4
              min-w-0   /* FIX: prevents width overflow */
            "
          >
            <div className="flex items-center justify-between px-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Your Spaces
              </h3>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {data?.length}
              </span>
            </div>

            <ScrollArea
              className="
                max-h-[calc(100vh-16rem)]   /* FIX: safer height */
                overflow-y-auto
                pr-2                         /* FIX: scrollbar spacing */
              "
            >
              <div className="flex flex-col gap-2">
                {data?.map((item) => {
                  const isActive =
                    selectedCommunity === item.community.id

                  return (
                    <button
                      key={item.community.id}
                      onClick={() =>
                        setSelectedCommunity(item.community.id)
                      }
                      className={cn(
                        "group flex items-center w-full p-3 rounded-xl text-left transition-all duration-200 border border-transparent",
                        isActive
                          ? "bg-background shadow-md border-border/50 ring-1 ring-black/5 dark:ring-white/10"
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "size-10 rounded-lg flex items-center justify-center mr-3 transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                        )}
                      >
                        <Hash className="size-5" />
                      </div>

                      <div className="flex-1 min-w-0 truncate">
                        {/* FIX: min-w-0 */}
                        <div
                          className={cn(
                            "font-medium truncate",
                            isActive ? "text-foreground" : ""
                          )}
                        >
                          {item.community.name}
                        </div>
                        {isActive && (
                          <div className="text-xs text-muted-foreground truncate opacity-80">
                            Active now
                          </div>
                        )}
                      </div>

                      {isActive && (
                        <ChevronRight className="size-4 text-muted-foreground ml-2 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* CONTENT */}
          <div className="col-span-12 lg:col-span-9 space-y-8 min-w-0">
            {/* Mobile selector */}
            <div className="lg:hidden">
              <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide">
                {data?.map((item) => (
                  <Button
                    key={item.community.id}
                    variant={
                      selectedCommunity === item.community.id
                        ? "default"
                        : "outline"
                    }
                    className="rounded-full whitespace-nowrap"
                    size="sm"
                    onClick={() =>
                      setSelectedCommunity(item.community.id)
                    }
                  >
                    {item.community.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-3 pb-6 border-b">
                <h2 className="text-4xl font-extrabold tracking-tight">
                  {currentCommunity?.name}
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  {currentCommunity?.description}
                </p>
              </div>

              <Tabs defaultValue="my-goals" className="space-y-8">
                <TabsList className="bg-transparent p-0 border-b w-full justify-start rounded-none h-auto gap-8">
                  <TabsTrigger value="my-goals">
                    <BookOpen className="size-4 mr-2" />
                    Learning Goals
                  </TabsTrigger>
                  <TabsTrigger value="find-study-mate">
                    <Users className="size-4 mr-2" />
                    AI Matchmaking
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="my-goals" className="space-y-6 animate-in fade-in-50 duration-300 slide-in-from-left-2 focus-visible:outline-none">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        Your Roadmap
                        <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-normal text-muted-foreground">{goals.length} goals</span>
                      </h3>
                    </div>
                    <Button onClick={addGoal} className="rounded-full shadow-sm">
                      <Plus className="size-4 mr-2" />
                      New Goal
                    </Button>
                  </div>

                  {isLoadingGoals ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse shadow-sm border-none bg-muted/20">
                          <CardHeader><div className="h-6 w-3/4 bg-muted/50 rounded-md"></div></CardHeader>
                          <CardContent><div className="h-4 w-full bg-muted/50 rounded-md mb-2"></div><div className="h-4 w-2/3 bg-muted/50 rounded-md"></div></CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : goals.length === 0 ? (
                    <div className="border-2 border-dashed border-muted rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-muted/5 hover:bg-muted/10 transition-colors">
                      <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                        <BookOpen className="size-8 text-primary/60" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No goals defined yet</h3>
                      <p className="text-muted-foreground max-w-md mb-6">
                        Setting clear learning goals boosts your chances of success. Define what you want to achieve in this community.
                      </p>
                      <Button onClick={addGoal} variant="outline" className="rounded-full border-primary/20 hover:border-primary/50 text-foreground">
                        Create First Goal
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {goals.map((goal) => (
                        <Card key={goal.id} className="group transition-all hover:-translate-y-1 hover:shadow-lg border-muted/60 bg-card">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{goal.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground line-clamp-3 leading-relaxed">{goal.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="find-study-mate">
                  <AiMatching goals={goals} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommunitiesPage
