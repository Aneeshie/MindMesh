import Link from "next/link";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CTASection = () => {
  return (
    <section className="section-container section-padding">
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-tr from-primary/10 via-background to-background p-8 sm:p-10 lg:p-12 shadow-lg animate-fade-up-soft">
        <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-primary/15 blur-3xl animate-float-soft" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] items-center">
          <div className="animate-fade-up-soft-slow">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 bg-background/60 text-xs font-medium uppercase tracking-wide text-primary"
            >
              Built for serious learners, not endless scrolling
            </Badge>
            <h2 className="section-heading mb-3">
              Ready to make your next study session{" "}
              <span className="gradient-text">actually count?</span>
            </h2>
            <p className="section-description mb-6">
              Create your profile, share your goals, and let MeshMind match you
              with learners who’ll keep you honest, motivated, and moving
              forward—session after session.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="link-button hero-button-primary">
                <Link href="/sign-up">
                  <span className="hero-button-content">
                    Join the community
                    <ArrowRight className="hero-button-icon-primary" />
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="link-button hero-button-outline"
              >
                <Link href="/sign-in">
                  <span className="hero-button-content">
                    I already have an account
                  </span>
                </Link>
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3 text-primary" />
                <span>No credit card required to get started.</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Users className="size-3 text-primary" />
                <span>Perfect for solo learners and small accountability pods.</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block animate-fade-up-soft-slow animate-delay-2">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl animate-float-soft" />
            <div className="relative rounded-2xl border bg-background/80 p-6 shadow-xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-primary">
                A session you might see on MeshMind
              </p>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">
                    Sunday Focus · 90-minute build session
                  </p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    In 2 hours
                  </span>
                </div>
                <div className="rounded-lg border bg-muted/60 p-3">
                  <p className="mb-1 text-[11px] font-medium text-muted-foreground">
                    Shared intention
                  </p>
                  <p>
                    Ship one meaningful thing. No multitasking. Cameras optional,
                    honesty required.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border bg-background/80 p-3">
                    <p className="mb-1 text-[11px] font-medium text-muted-foreground">
                      You
                    </p>
                    <p>Outline 3 chapters of exam notes &amp; build flashcards.</p>
                  </div>
                  <div className="rounded-lg border bg-background/80 p-3">
                    <p className="mb-1 text-[11px] font-medium text-muted-foreground">
                      Partner
                    </p>
                    <p>Implement 2 practice problems and review solutions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
