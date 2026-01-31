"use client"

import StatsCard from '@/components/dashboard/stats-card'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useCommunites } from '@/hooks/use-community'

import { useUser } from '@clerk/nextjs'
import { MessageCircle, UserIcon } from 'lucide-react'
import Link from 'next/link'

const DashboardPage = () => {
  const { user } = useUser()

  const { data, isLoading, error } = useCommunites();

  const pendingMatches = 1

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-72 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="page-wrapper space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName || "champ"} 👋
        </p>
      </div>

      {/* Matches Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            You have {pendingMatches} pending {pendingMatches === 1 ? "match" : "matches"}!
          </CardTitle>
          <CardDescription>
            Review and accept or decline matches waiting for you.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Link href="/chat">
            <Button>Review Matches</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard title="Learning Goals" value={5} />
        <StatsCard title="Active Matches" value={9} />
        <StatsCard title="Pending Matches" value={pendingMatches} />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Recent Chats */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <MessageCircle className="size-4 mr-2 text-primary" />
                Recent Chats
              </CardTitle>

              <Link href="/chat">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            <CardDescription>
              Your latest conversations
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Chats will appear here once conversations begin.
            </p>
          </CardContent>
        </Card>

        {/* Communities */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <UserIcon className="size-4 mr-2 text-primary" />
                Communities
              </CardTitle>

              <Link href="/communities">
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </Link>
            </div>

            <CardDescription>
              Communities you're part of
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">

            {data?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                You haven’t joined any communities yet.
              </p>
            )}

            {data?.map((item: any) => (
              <Link
                key={item.community.id}
                href={`/communities/${item.community.id}`}
              >
                <Card className="shadow-none hover:bg-muted transition cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-sm">
                      {item.community.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {item.community.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}

          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default DashboardPage
