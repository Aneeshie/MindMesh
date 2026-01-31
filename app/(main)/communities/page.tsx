"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AiMatching } from "@/components/communities/ai-matching"
import { useCommunites, useCommunityGoals } from "@/hooks/use-community"
import { useEffect, useState } from "react"
import Link from "next/link"

export type Goal = {
  id: string
  title: string
  description: string | null
}

const CommunitiesPage = () => {
  const { data, isLoading, error } = useCommunites()


  const [selectedCommunity, setSelectedCommunity] =
    useState<string | "">("")


  const { data: goals = [], isLoading: isLoadingGoals, error: errorGoals } = useCommunityGoals(selectedCommunity || "")

  const [activeTab, setActiveTab] = useState<
    "my-goals" | "find-study-mate"
  >("my-goals")

  useEffect(() => {
    if (data?.length) {
      setSelectedCommunity(data[0].community.id)
    }
  }, [data])

  const addGoal = () => {
    // TODO: Implement create goal mutation
    console.log("Add goal clicked - pending backend implementation")
  }

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <p className="text-muted-foreground">Loading communities…</p>
      </div>
    )
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="page-wrapper space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Communities
          </h1>
          <p className="text-muted-foreground">
            Learn together, grow faster.
          </p>
        </div>

        <Link href={"/communities/all"}>
          <Button variant="outline">
            + Join Community
          </Button>
        </Link>
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-4">

        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Your Communities</CardTitle>
            <CardDescription>
              {data?.length ?? 0} joined
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            {data?.map((community) => {
              const isActive =
                selectedCommunity === community.community.id

              return (
                <Button
                  key={community.community.id}
                  variant="ghost"
                  className={`w-full justify-start ${isActive ? "bg-muted font-medium" : ""
                    }`}
                  onClick={() =>
                    setSelectedCommunity(community.community.id)
                  }
                >
                  {community.community.name}
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="lg:col-span-3">
          <CardHeader>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={activeTab === "my-goals" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("my-goals")}
              >
                My Goals
              </Button>

              <Button
                variant={
                  activeTab === "find-study-mate"
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  setActiveTab("find-study-mate")
                }
              >
                Find Partners (AI)
              </Button>
            </div>

            <CardTitle>
              {activeTab === "my-goals"
                ? "Learning Goals"
                : "Find Study Partners with AI"}
            </CardTitle>

            <CardDescription>
              {activeTab === "my-goals"
                ? "Track what you’re working on."
                : "Get matched with the right people, not random ones."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* GOALS TAB */}
            {activeTab === "my-goals" && (
              <>
                <Button onClick={addGoal}>
                  + Add Learning Goal
                </Button>

                <div className="space-y-3">
                  {goals.map((goal) => (
                    <Card
                      key={goal.id}
                      className="shadow-none border"
                    >
                      <CardHeader>
                        <CardTitle className="text-base">
                          {goal.title}
                        </CardTitle>
                        <CardDescription>
                          {goal.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </>
            )}
            {/* FIND PARTNERS TAB */}
            {activeTab === "find-study-mate" && (
              <AiMatching goals={goals} />
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default CommunitiesPage
