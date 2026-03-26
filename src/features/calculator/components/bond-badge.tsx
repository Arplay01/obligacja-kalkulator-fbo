import type { BondBadgeKind } from "@/features/calculator/domain/types";
import {
  FixedRateIcon,
  InflationIcon,
  VariableRateIcon,
} from "@/features/calculator/components/icons";

type BondBadgeProps = {
  kind: BondBadgeKind;
  label: string;
  variant: "chip" | "result";
};

function BadgeIcon({ kind }: { kind: BondBadgeKind }) {
  if (kind === "fixed") {
    return <FixedRateIcon />;
  }

  if (kind === "variable") {
    return <VariableRateIcon />;
  }

  return <InflationIcon />;
}

export function BondBadge({ kind, label, variant }: BondBadgeProps) {
  const badgeClassName =
    variant === "chip"
      ? `bond-chip__badge bond-chip__badge--${kind}`
      : `results__badge results__badge--${kind}`;

  const iconClassName =
    variant === "chip" ? "bond-chip__badge-icon" : "results__badge-icon";

  return (
    <span className={badgeClassName}>
      <span className={iconClassName} aria-hidden="true">
        <BadgeIcon kind={kind} />
      </span>
      <span>{label}</span>
    </span>
  );
}

