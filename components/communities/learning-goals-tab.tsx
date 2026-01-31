"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { BookOpen, CheckCircle2, Loader2, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import type { CommunityGoal } from "@/hooks/use-community"
import { useCreateGoal, useUpdateGoal } from "@/hooks/use-community"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

type LearningGoalsTabProps = {
  communityId: string
  goals: CommunityGoal[]
  isLoadingGoals: boolean
}

export function LearningGoalsTab({
  communityId,
  goals,
  isLoadingGoals,
}: LearningGoalsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [newGoalDescription, setNewGoalDescription] = useState("")

  const { mutate: createGoal, isPending: isCreating } = useCreateGoal()
  const { mutate: updateGoal, isPending: isUpdating } = useUpdateGoal()

  const sortedGoals = useMemo(() => {
    const copy = [...goals]
    copy.sort((a, b) => {
      // Incomplete first
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1
      }
      // Newest first (fallback-safe)
      const aTime = a.createdAt ? Date.parse(a.createdAt) : 0
      const bTime = b.createdAt ? Date.parse(b.createdAt) : 0
      return bTime - aTime
    })
    return copy
  }, [goals])

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!communityId) return
    if (!newGoalTitle.trim()) {
      toast.error("Please enter a goal title")
      return
    }

    createGoal(
      {
        communityId,
        title: newGoalTitle,
        description: newGoalDescription,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false)
          setNewGoalTitle("")
          setNewGoalDescription("")
        },
      }
    )
  }

  const toggleGoalCompletion = (goal: CommunityGoal) => {
    if (!communityId) return
    updateGoal({
      communityId,
      goalId: goal.id,
      isCompleted: !goal.isCompleted,
    })
  }

  return (
    <div className="flex flex-col gap-4 min-h-0">
      <div className="flex items-center justify-between pb-2 shrink-0">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Your Roadmap
            <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-normal text-muted-foreground">
              {goals.length} goals
            </span>
          </h3>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-sm" size="sm" disabled={!communityId}>
              <Plus className="size-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set a Learning Goal</DialogTitle>
              <DialogDescription>
                Define what you want to achieve. Specific, measurable goals work best.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateGoal} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Complete Advanced React Course"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  disabled={isCreating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add more details, resources, or a deadline..."
                  value={newGoalDescription}
                  onChange={(e) => setNewGoalDescription(e.target.value)}
                  disabled={isCreating}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Goal"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Local scroll area: fixed-height container so goals don't keep stretching the page */}
      <ScrollArea className="h-[min(60vh,28rem)] pr-4 -mr-4">
        {isLoadingGoals ? (
          <div className="flex flex-col gap-3 pb-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse shadow-sm border-none bg-muted/20">
                <CardHeader>
                  <div className="h-6 w-3/4 bg-muted/50 rounded-md"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full bg-muted/50 rounded-md mb-2"></div>
                  <div className="h-4 w-2/3 bg-muted/50 rounded-md"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedGoals.length === 0 ? (
          <div className="min-h-72 border-2 border-dashed border-muted rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-muted/5 hover:bg-muted/10 transition-colors">
            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
              <BookOpen className="size-8 text-primary/60" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No goals defined yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Setting clear learning goals boosts your chances of success. Define what you want to
              achieve in this community.
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
              className="rounded-full border-primary/20 hover:border-primary/50 text-foreground"
            >
              Create First Goal
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-6">
            {sortedGoals.map((goal) => (
              <Card
                key={goal.id}
                className={cn(
                  "group transition-all duration-300 border-l-4",
                  goal.isCompleted
                    ? "bg-green-50/50 dark:bg-green-950/20 border-l-green-500 border-y-transparent border-r-transparent shadow-none"
                    : "bg-card border-l-primary/50 hover:border-l-primary hover:shadow-md"
                )}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="mt-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "rounded-full size-6 ring-2 ring-offset-2 transition-all",
                        goal.isCompleted
                          ? "bg-green-500 text-white ring-green-500 hover:bg-green-600 hover:ring-green-600"
                          : "ring-muted-foreground/30 text-transparent hover:ring-primary/50"
                      )}
                      onClick={() => toggleGoalCompletion(goal)}
                      disabled={isUpdating}
                    >
                      {goal.isCompleted && <CheckCircle2 className="size-4" />}
                    </Button>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={cn(
                          "font-semibold text-base leading-none",
                          goal.isCompleted &&
                          "text-muted-foreground line-through decoration-muted-foreground/50"
                        )}
                      >
                        {goal.title}
                      </h4>
                      {goal.isCompleted && (
                        <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ml-2">
                          Done
                        </span>
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-sm text-muted-foreground leading-normal",
                        goal.isCompleted && "opacity-70 line-through"
                      )}
                    >
                      {goal.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

