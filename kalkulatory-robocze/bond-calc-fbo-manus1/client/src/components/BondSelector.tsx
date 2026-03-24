/**
 * Bond Selector – Interactive cards for choosing bond types
 * Design: Color-coded cards with key info, toggleable
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Clock, Users } from "lucide-react";
import { BONDS, type BondType } from "@/lib/bondCalculator";

interface Props {
  selectedBonds: BondType[];
  onToggle: (bondType: BondType) => void;
}

export default function BondSelector({ selectedBonds, onToggle }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Wybierz obligacje do porównania
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kliknij, aby dodać lub usunąć z porównania.
          </p>
        </div>
        <Badge variant="secondary" className="tabular-nums">
          {selectedBonds.length} / {BONDS.length}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {BONDS.map((bond) => {
          const isSelected = selectedBonds.includes(bond.type);
          return (
            <Tooltip key={bond.type}>
              <TooltipTrigger asChild>
                <Card
                  className={`
                    relative cursor-pointer transition-all duration-200 border-2
                    ${isSelected
                      ? 'border-primary/40 bg-primary/[0.03] shadow-sm'
                      : 'border-transparent bg-card hover:border-border/60 hover:shadow-sm'
                    }
                  `}
                  onClick={() => onToggle(bond.type)}
                >
                  {/* Color accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-lg transition-opacity"
                    style={{
                      backgroundColor: bond.color,
                      opacity: isSelected ? 1 : 0.3,
                    }}
                  />

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}

                  <CardContent className="pt-4 pb-3 px-3">
                    <div className="flex items-start gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-base font-bold text-foreground">
                            {bond.name}
                          </span>
                          {bond.isFamily && (
                            <Users className="w-3.5 h-3.5 text-amber-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {bond.durationLabel}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <span
                        className="tabular-nums text-lg font-bold"
                        style={{ color: bond.color }}
                      >
                        {bond.firstYearRate.toFixed(2)}%
                      </span>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                        {bond.categoryLabel}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[240px] text-xs">
                <p className="font-medium">{bond.fullName}</p>
                <p className="mt-1 text-muted-foreground">{bond.description}</p>
                {bond.margin > 0 && (
                  <p className="mt-1">
                    Marża od 2. roku: <span className="font-medium">+{bond.margin.toFixed(2)}%</span> ponad {bond.category === 'inflation' ? 'inflację' : 'stopę NBP'}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
