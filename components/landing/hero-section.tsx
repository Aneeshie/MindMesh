import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const HeroSection = () => {
  return (
    <section className="section-container section-padding animate-fade-up-soft">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_minmax(0,1fr)] items-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground mb-4 animate-fade-up-soft-slow animate-delay-1">
            <Sparkles className="size-3 text-primary animate-shimmer-soft" />
            <span>AI-matched study partners • Social, goal-driven learning</span>
          </div>

          <h1 className="tracking-tight">
            Learn faster with{" "}
            <span className="gradient-text">people who study like you.</span>
          </h1>

          <p className="hero-subheading">
            MeshMind is a community learning platform that intelligently matches
            you with compatible study partners based on your goals, interests,
            and learning style. Set goals, meet your match, and turn every
            session into real progress.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center animate-fade-up-soft-slow animate-delay-2">
            <Button
              asChild
              className="link-button hero-button-primary"
              size="lg"
            >
              <Link href="/sign-up">
                <span className="hero-button-content">
                  Get started free
                  <ArrowRight className="hero-button-icon-primary" />
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="link-button hero-button-outline"
            >
              <Link href="#how-it-works">
                <span className="hero-button-content">
                  See how it works
                  <MessageCircle className="hero-button-icon-outline" />
                </span>
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-up-soft-slow animate-delay-3">
            <div className="flex -space-x-2 overflow-hidden">
              {["AM", "JR", "SK", "LM", "AZ"].map((initials) => (
                <div
                  key={initials}
                  className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary ring-2 ring-background animate-float-soft"
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="mb-0 text-xs sm:text-sm text-muted-foreground">
              Matching learners across goals like{" "}
              <span className="font-medium text-foreground">
                FAANG interviews, med school, design portfolios, and more.
              </span>
            </p>
          </div>
        </div>

        <div className="relative animate-float-soft">
          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-tr from-primary/15 via-primary/5 to-transparent blur-2xl" />

          <Card className="relative border-muted/80 bg-card/80 backdrop-blur shadow-xl animate-fade-up-soft-slow animate-delay-2">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    Live study match
                  </p>
                  <p className="text-sm font-semibold">
                    Tonight · Deep work sprint · 8:00 – 9:30pm
                  </p>
                </div>
                <Badge variant="outline" className="gap-1 text-xs">
                  <Users className="size-3 text-primary" />
                  Matched
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border bg-muted/40 p-3">
                  <p className="mb-1 text-[11px] font-medium text-muted-foreground">
                    Your goal
                  </p>
                  <p className="font-semibold text-sm">
                    Finish spaced-repetition deck for{" "}
                    <span className="underline decoration-primary/60">
                      Systems Design
                    </span>
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/40 p-3">
                  <p className="mb-1 text-[11px] font-medium text-muted-foreground">
                    Partner&apos;s goal
                  </p>
                  <p className="font-semibold text-sm">
                    Practice whiteboard rounds on{" "}
                    <span className="underline decoration-primary/60">
                      Distributed Systems
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-lg border bg-background/80 p-3 text-xs">
                <div className="mb-1 flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                  <Sparkles className="size-3 text-primary" />
                  AI session summary · Next steps
                </div>
                <p className="mb-2">
                  You both struggled with tradeoff explanations. Next session,
                  focus on 2–3 diagrams per answer and narrate your mental
                  model out loud.
                </p>
                <p className="mb-0 text-[11px] text-muted-foreground">
                  Added 3 action items to your shared checklist.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
