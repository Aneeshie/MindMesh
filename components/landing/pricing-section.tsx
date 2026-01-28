import { PricingTable } from "@clerk/nextjs";

import { Card, CardContent } from "@/components/ui/card";

const PricingSection = () => {
  return (
    <section className="section-container section-padding" id="pricing">
      <div className="mx-auto max-w-3xl text-center mb-10 animate-fade-up-soft">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
          Pricing
        </p>
        <h2 className="section-heading">
          Start free,{" "}
          <span className="gradient-text">upgrade when you’re ready.</span>
        </h2>
        <p className="section-description mt-4">
          Join the community, explore AI-matched partners, and upgrade to unlock
          advanced matching filters, longer sessions, and team features.
        </p>
      </div>

      <Card className="border-muted/80 bg-card/80 backdrop-blur animate-fade-up-soft-slow animate-delay-2">
        <CardContent className="pt-6">
          {/* 
            Clerk's <PricingTable /> reads configuration from your Clerk dashboard.
            You can customize plans, appearance, and copy from there without
            touching this component.
          */}
          <div className="rounded-xl border bg-background/80 p-4 sm:p-6">
            <PricingTable />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default PricingSection;
