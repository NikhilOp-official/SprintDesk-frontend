import SummaryCard from "../SummaryCard";
import { CheckCircle2, CircleDot, Clock3, Eye, ListTodo } from "lucide-react";
import type { ProjectSummary } from "@/store/api/types";

interface IssueSummaryProps {
  summary: ProjectSummary;
}

function IssueSummary({ summary }: IssueSummaryProps) {
  return (
    <section aria-label="Issue summary">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Issue overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A summary of issues across this project.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <SummaryCard
          title="Total issues"
          value={summary.totalIssues}
          icon={<CircleDot className="size-5" />}
          iconClass="bg-primary/10 text-primary"
        />

        <SummaryCard
          title="To Do"
          value={summary.todo}
          icon={<ListTodo className="size-5" />}
          iconClass="bg-slate-500/10 text-slate-600 dark:text-slate-300"
        />

        <SummaryCard
          title="In Progress"
          value={summary.inProgress}
          icon={<Clock3 className="size-5" />}
          iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />

        <SummaryCard
          title="In Review"
          value={summary.inReview}
          icon={<Eye className="size-5" />}
          iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />

        <SummaryCard
          title="Done"
          value={summary.done}
          icon={<CheckCircle2 className="size-5" />}
          iconClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
      </div>
    </section>
  );
}

export default IssueSummary;
