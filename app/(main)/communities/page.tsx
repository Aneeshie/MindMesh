"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AiMatching } from "@/components/communities/ai-matching"
import { LearningGoalsTab } from "@/components/communities/learning-goals-tab"
import { useCommunites, useCommunityGoals } from "@/hooks/use-community"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Hash, Users, BookOpen, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const CommunitiesPage = () => {
  const { data, isLoading, error } = useCommunites()
  const [selectedCommunity, setSelectedCommunity] = useState<string | "">("")

  const {
    data: goals = [],
    isLoading: isLoadingGoals,
    error: errorGoals
  } = useCommunityGoals(selectedCommunity || "")

  useEffect(() => {
    if (data?.length && !selectedCommunity) {
      setSelectedCommunity(data[0].community.id)
    }
  }, [data, selectedCommunity])

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
    <div className="page-wrapper max-w-7xl mx-auto space-y-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-end justify-between border-b pb-4">
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
        <div className="grid gap-8 lg:grid-cols-12 items-start h-[calc(100vh-12rem)]">
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
          <div className="col-span-12 lg:col-span-9 flex flex-col h-full space-y-6 min-w-0">
            {/* Mobile selector */}
            <div className="lg:hidden shrink-0">
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

            <div className="shrink-0 space-y-2 pb-2">
              <h2 className="text-3xl font-extrabold tracking-tight">
                {currentCommunity?.name}
              </h2>
              <p className="text-lg text-muted-foreground line-clamp-1">
                {currentCommunity?.description}
              </p>
            </div>

            <Tabs defaultValue="my-goals" className="flex-1 flex flex-col space-y-6 min-h-0">
              <TabsList className="bg-transparent p-0 border-b w-full justify-start rounded-none h-auto gap-8 shrink-0">
                <TabsTrigger value="my-goals">
                  <BookOpen className="size-4 mr-2" />
                  Learning Goals
                </TabsTrigger>
                <TabsTrigger value="find-study-mate">
                  <Users className="size-4 mr-2" />
                  AI Matchmaking
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="my-goals"
                className="flex-1 flex flex-col space-y-4 animate-in fade-in-50 duration-300 slide-in-from-left-2 focus-visible:outline-none min-h-0"
              >
                <LearningGoalsTab
                  communityId={selectedCommunity || ""}
                  goals={goals}
                  isLoadingGoals={isLoadingGoals}
                />
              </TabsContent>

              <TabsContent value="find-study-mate">
                <AiMatching goals={goals} selectedCommunity={selectedCommunity} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )
      }
    </div >
  )
}

export default CommunitiesPage
