import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: number;
  description?: string;
  icon: ReactNode;
  iconClass: string;
}

export default function SummaryCard({
  title,
  value,
  description,
  icon,
  iconClass,
}: SummaryCardProps) {
  return (
    <Card className="border-border/80 bg-background py-0 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between gap-4 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {value}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>

        <div
          className={`grid size-11 shrink-0 place-items-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
