"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { CommunityGoal } from "@/hooks/use-community"
import { Sparkles, Target, Users, Zap, CheckCircle2 } from "lucide-react"

interface AiMatchingProps {
    goals: CommunityGoal[]
}

export const AiMatching = ({ goals }: AiMatchingProps) => {
    return (
        <div className="grid gap-8 lg:grid-cols-3">
            {/* Main matching card */}
            <Card className="lg:col-span-2 border-0 shadow-xl shadow-primary/5 bg-linear-to-br from-background via-muted/20 to-muted/40 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <CardHeader className="relative pb-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-primary/20 text-primary-foreground">
                            <Sparkles className="size-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">
                                Study Partner AI
                            </CardTitle>
                            <CardDescription className="text-base">
                                Intelligent matching based on your goals and habits.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="relative space-y-8 pt-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background/80 backdrop-blur-sm p-5 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center gap-2">
                            <span className="text-4xl font-extrabold text-foreground">{goals.length}</span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Goals</span>
                        </div>
                        <div className="bg-background/80 backdrop-blur-sm p-5 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center gap-2">
                            <span className="text-4xl font-extrabold text-primary">{goals.length * 2}</span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Matches Found</span>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="space-y-4 pt-2">
                        <Button className="w-full h-14 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:shadow-primary/30" size="lg">
                            <Zap className="size-5 mr-2 fill-current" />
                            Run AI Matchmaker
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            By clicking run, you agree to share your learning profile with matches.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Sidebar "How it works" */}
            <div className="lg:col-span-1 space-y-6 flex flex-col justify-center py-4">
                <h4 className="font-semibold px-1">Why use AI matching?</h4>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Target className="size-4" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-sm">Goal Aligned</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">Matches are prioritized based on overlapping learning objectives and timelines.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="size-8 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                            <Users className="size-4" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-sm">Skill Compatible</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">Find peers who are at a similar or complementary skill level to you.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="size-8 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="size-4" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-sm">Consistency</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">We match you with active learners who maintain streaks.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
