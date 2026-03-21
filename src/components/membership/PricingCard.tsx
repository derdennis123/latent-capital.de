import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

interface PricingTier {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

interface PricingCardProps {
  tier: PricingTier;
}

export default function PricingCard({ tier }: PricingCardProps) {
  return (
    <GlassCard
      className={`relative p-8 flex flex-col ${
        tier.highlighted
          ? "border-[#6C5CE7]/30 ring-1 ring-[#6C5CE7]/20"
          : ""
      }`}
    >
      {tier.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className="inline-block bg-[#6C5CE7] text-white text-xs font-medium px-4 py-1 rounded-full"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Empfohlen
          </span>
        </div>
      )}

      <h3
        className="text-xl font-bold text-[#1a1a1a] mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {tier.name}
      </h3>

      <div className="mb-6">
        <span
          className="text-3xl font-bold text-[#1a1a1a]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {tier.price}
        </span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm text-[#666]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={tier.highlighted ? "#6C5CE7" : "#999"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0 mt-0.5"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={tier.highlighted ? "primary" : "secondary"}
        size="lg"
        href={tier.ctaHref ?? "/membership"}
        className="w-full"
      >
        {tier.ctaLabel ?? "Auswählen"}
      </Button>
    </GlassCard>
  );
}
