import React from "react";
import IssueCard from "./IssueCard";
import type { Issue, IssueStatus } from "@/store/api/issues/types";
import { CheckCircle2, Clock3, Eye, Circle } from "lucide-react";
import { toast } from "sonner";
import { useUpdateIssueMutation } from "@/store/api/issues/mutation";
import { usePermissions } from "@/hooks/usePermissions";
import type { Project } from "@/store/api/types";

const columnConfig: Record<
  IssueStatus,
  { icon: typeof Circle; color: string; background: string }
> = {
  "To Do": {
    icon: Circle,
    color: "text-slate-500",
    background: "bg-slate-100 dark:bg-slate-800",
  },
  "In Progress": {
    icon: Clock3,
    color: "text-blue-600 dark:text-blue-400",
    background: "bg-blue-50 dark:bg-blue-950/40",
  },
  "In Review": {
    icon: Eye,
    color: "text-violet-600 dark:text-violet-400",
    background: "bg-violet-50 dark:bg-violet-950/40",
  },
  Done: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    background: "bg-emerald-50 dark:bg-emerald-950/40",
  },
};
interface IssuesColumnProps {
  column: IssueStatus;
  issues: Issue[];
  onOpenIssue: (issue: Issue) => void;
  project: Project;
}
function IssuesColumn({
  column,
  issues,
  onOpenIssue,
  project,
}: IssuesColumnProps) {
  const { canEditIssue } = usePermissions();
  const columnIssues = issues.filter((issue) => issue.status === column);
  const config = columnConfig[column];
  const ColumnIcon = config.icon;

  const [updateIssue] = useUpdateIssueMutation();

  const handleStatusChange = async (issue: Issue, nextStatus: IssueStatus) => {
    if (nextStatus === issue.status) return;

    try {
      await updateIssue({
        id: issue._id,
        status: nextStatus,
      }).unwrap();

      toast.success("Issue status updated");
    } catch {
      toast.error("Unable to update issue status");
    }
  };
  return (
    <section
      key={column}
      className="min-w-0 overflow-hidden rounded-2xl border bg-muted/20"
    >
      {/* Column header */}
      <div className="flex items-center justify-between gap-2 border-b bg-card px-3 py-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${config.background}`}
          >
            <ColumnIcon className={`size-4 ${config.color}`} />
          </span>

          <h3 className="truncate text-sm font-semibold">{column}</h3>
        </div>

        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border bg-background text-xs font-semibold tabular-nums text-muted-foreground">
          {columnIssues.length}
        </span>
      </div>

      {/* Column content */}
      <div className="min-h-36 space-y-3 p-3">
        {columnIssues.length > 0 ? (
          columnIssues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onOpen={onOpenIssue}
              onStatusChange={handleStatusChange}
              canEdit={canEditIssue(issue, project)}
            />
          ))
        ) : (
          <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 px-3 py-5 text-center">
            <ColumnIcon className={`mb-2 size-4 ${config.color} opacity-70`} />
            <p className="text-xs text-muted-foreground">No issues here</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default IssuesColumn;
