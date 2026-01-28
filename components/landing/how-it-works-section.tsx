import { ArrowRight, CalendarClock, CheckSquare, Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    label: "Step 1",
    title: "Set your learning goals",
    description:
      "Tell MeshMind what you’re working toward—like passing a midterm, shipping a portfolio, or landing a new role—and how you like to learn.",
    icon: CheckSquare,
  },
  {
    label: "Step 2",
    title: "Get AI-curated partner matches",
    description:
      "We surface the most compatible partners based on subject, schedule, experience level, and learning style, so every match feels natural.",
    icon: Sparkles,
  },
  {
    label: "Step 3",
    title: "Study together, get AI summaries",
    description:
      "Jump into real-time chat, keep each other accountable, and receive an AI-generated summary with concrete action items when you’re done.",
    icon: CalendarClock,
  },
];

const HowItWorksSection = () => {
  return (
    <section
      className="section-container section-padding border-y bg-muted/30"
      id="how-it-works"
    >
      <div className="mx-auto max-w-3xl text-center mb-10 animate-fade-up-soft">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
          How MeshMind works
        </p>
        <h2 className="section-heading">
          From vague goals to{" "}
          <span className="gradient-text">accountable study partners</span> in
          minutes.
        </h2>
        <p className="section-description mt-4">
          Under the hood, MeshMind learns your preferences over time so each new
          match feels more tailored than the last.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card
            key={step.label}
            className={`relative flex flex-col border-muted/80 bg-card/80 backdrop-blur animate-fade-up-soft-slow ${
              index === 0
                ? "animate-delay-1"
                : index === 1
                ? "animate-delay-2"
                : "animate-delay-3"
            }`}
          >
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span>{step.label}</span>
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
                  <step.icon className="size-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 text-xs text-muted-foreground sm:flex-row sm:justify-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 shadow-xs">
          <Sparkles className="size-3 text-primary" />
          <span>
            MeshMind adapts to your schedule—weeknight sprints, weekend deep
            work, or daily pomodoro bursts.
          </span>
        </div>
        <div className="inline-flex items-center gap-2">
          <ArrowRight className="size-3 text-primary" />
          <span>It takes under 2 minutes to get your first match.</span>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
