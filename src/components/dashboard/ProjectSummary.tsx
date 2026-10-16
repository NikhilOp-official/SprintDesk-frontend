import { Archive, CheckCircle2, FolderKanban } from "lucide-react";
import SummaryCard from "../SummaryCard";

interface ProjectSummaryProps {
  total: number;
  active: number;
  archived: number;
}

export default function ProjectSummary({
  total,
  active,
  archived,
}: ProjectSummaryProps) {
  const summaries = [
    {
      title: "All projects",
      value: total,
      description: "Projects you can access",
      icon: <FolderKanban className="size-5" />,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      title: "Active projects",
      value: active,
      description: "Currently active",
      icon: <CheckCircle2 className="size-5" />,
      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Archived projects",
      value: archived,
      description: "Read-only projects",
      icon: <Archive className="size-5" />,
      iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <section aria-label="Project summary">
      <div className="mb-4">
        <h2 className="text-base font-semibold tracking-tight">At a glance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          An overview of your accessible projects.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {summaries.map((summary) => (
          <SummaryCard key={summary.title} {...summary} />
        ))}
      </div>
    </section>
  );
}
