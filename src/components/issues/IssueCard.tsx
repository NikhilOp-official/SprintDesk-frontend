import type { Issue } from "@/store/api/issues/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusOptions } from "@/constants/options";
import {
  CalendarDays,
  CircleUserRound,
  Flag,
  ArrowUpRight,
} from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";

interface IssueCardProps {
  issue: Issue;
  onOpen: (issue: Issue) => void;
  onStatusChange: (issue: Issue, status: Issue["status"]) => void;
  canEdit: boolean;
}

const priorityStyles: Record<
  Issue["priority"],
  {
    badge: string;
    dot: string;
  }
> = {
  High: {
    badge:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300",
    dot: "bg-red-500",
  },
  Medium: {
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  Low: {
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
};

const IssueCard = ({
  issue,
  onOpen,
  onStatusChange,
  canEdit,
}: IssueCardProps) => {
  const assignee =
    issue.assigneeId && typeof issue.assigneeId !== "string"
      ? issue.assigneeId.name
      : "Unassigned";

  const priorityStyle = priorityStyles[issue.priority];

  return (
    <Card className="group min-w-0 overflow-hidden border-border/80 bg-background py-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <CardContent className="space-y-4 p-4">
        <button
          type="button"
          onClick={() => onOpen(issue)}
          aria-label={`Open issue: ${issue.title}`}
          className="flex w-full min-w-0 items-start justify-between gap-3 rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="min-w-0 break-words text-sm font-semibold leading-5 tracking-tight transition-colors group-hover:text-primary sm:text-base">
            {issue.title}
          </span>

          <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </button>

        {/* Description */}
        <p className="line-clamp-2 min-h-10 break-words text-sm leading-5 text-muted-foreground">
          {issue.description || "No description provided."}
        </p>

        {/* Priority and assignee */}
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <Badge
            variant="outline"
            className={`gap-1.5 font-semibold ${priorityStyle.badge}`}
          >
            <span className={`size-1.5 rounded-full ${priorityStyle.dot}`} />
            <Flag className="size-3" />
            {issue.priority}
          </Badge>

          <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <CircleUserRound className="size-4 shrink-0" />
            <span className="max-w-32 truncate">{assignee}</span>
          </span>
        </div>

        {issue.dueDate && (
          <div className="flex items-center gap-2 border-t border-border/70 pt-3 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0" />
            <span>Due {formatDate(issue.dueDate)}</span>
          </div>
        )}

        {canEdit && (
          <div className="border-t border-border/70 pt-3">
            <label
              htmlFor={`issue-status-${issue._id}`}
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Status
            </label>

            <select
              id={`issue-status-${issue._id}`}
              aria-label={`Change status for ${issue.title}`}
              value={issue.status}
              onChange={(event) =>
                onStatusChange(issue, event.target.value as Issue["status"])
              }
              onClick={(event) => event.stopPropagation()}
              className="h-9 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IssueCard;
