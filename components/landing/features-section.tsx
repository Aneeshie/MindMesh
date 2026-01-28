import {
  Brain,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Users,
    label: "AI partner matching",
    title: "Study with people who learn like you",
    description:
      "MeshMind matches you with partners based on goals, subjects, availability, and learning style—not just random chatrooms.",
  },
  {
    icon: Target,
    label: "Goal tracking",
    title: "Turn vague intentions into concrete plans",
    description:
      "Set session goals, timeboxes, and checklists together so every study block has a clear, shared outcome.",
  },
  {
    icon: MessageCircle,
    label: "Real-time sessions",
    title: "Chat, co-notes, and live accountability",
    description:
      "Stay focused with shared timers, live chat, and gentle nudges when someone drifts off track.",
  },
  {
    icon: Brain,
    label: "AI summaries",
    title: "Walk away with action items, not just vibes",
    description:
      "Every session ends with AI-generated summaries and next steps that sync back to your goals.",
  },
];

const FeatureSection = () => {
  return (
    <section className="section-container section-padding" id="features">
      <div className="mx-auto max-w-3xl text-center mb-10 animate-fade-up-soft">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
          Why learners stay with MeshMind
        </p>
        <h2 className="section-heading">
          All the social energy of a study group,{" "}
          <span className="gradient-text">without the chaos.</span>
        </h2>
        <p className="section-description mt-4">
          We combine social accountability with AI-powered guidance so every
          session moves you meaningfully closer to your goals.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature, index) => (
          <Card
            key={feature.label}
            className={`border-muted/80 bg-card/80 backdrop-blur hover:-translate-y-0.5 hover:shadow-lg transition-all animate-fade-up-soft-slow ${
              index === 0
                ? "animate-delay-1"
                : index === 1
                ? "animate-delay-2"
                : index === 2
                ? "animate-delay-3"
                : "animate-delay-4"
            }`}
          >
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
                <feature.icon className="size-4" />
                <span>{feature.label}</span>
              </div>
              <CardTitle className="text-base sm:text-lg">
                {feature.title}
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1">
          <CheckCircle2 className="size-3 text-primary" />
          <span>Designed for solo learners, small cohorts, and community leads</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="size-3 text-primary" />
          <span>Most learners book a second session within 48 hours.</span>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
