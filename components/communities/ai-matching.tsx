"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Goal } from "@/app/(main)/communities/page"

interface AiMatchingProps {
    goals: Goal[]
}

export const AiMatching = ({ goals }: AiMatchingProps) => {
    return (
        <Card className="border">
            <CardHeader>
                <CardTitle>
                    AI-Powered Study Partner Matching
                </CardTitle>
                <CardDescription>
                    Based on your current setup, AI can help you find compatible partners.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                            Learning Goals Set
                        </p>
                        <p className="text-2xl font-bold">
                            {goals.length}
                        </p>
                    </div>

                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                            Potential Matches
                        </p>
                        <p className="text-2xl font-bold">
                            {goals.length * 2}
                        </p>
                    </div>
                </div>

                {/* Explanation */}
                <ul className="text-sm text-muted-foreground space-y-2 list-disc ml-5">
                    <li>Matches are generated using your learning goals</li>
                    <li>Community-specific and skill-aligned</li>
                    <li>Prioritizes consistency over random pairing</li>
                </ul>

                {/* CTA */}
                <Button className="w-full">
                    Find Partners with AI
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                    Tip: Adding more goals improves match accuracy.
                </p>
            </CardContent>
        </Card>
    )
}
