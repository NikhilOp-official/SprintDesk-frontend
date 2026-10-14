import type { Issue } from "@/store/api/issues/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IssueCardProps {
  issue: Issue;
  onOpen: (issue: Issue) => void;
  onStatusChange: (issue: Issue, status: Issue["status"]) => void;
  canEdit: boolean;
}

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

  const priorityVariant =
    issue.priority === "High"
      ? "destructive"
      : issue.priority === "Medium"
        ? "secondary"
        : "outline";

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md">
      <CardContent className="space-y-3 p-4">
        <button
          type="button"
          onClick={() => onOpen(issue)}
          className="w-full text-left font-semibold hover:underline"
        >
          {issue.title}
        </button>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {issue.description || "No description provided"}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={priorityVariant}>{issue.priority}</Badge>
          <span className="text-xs text-muted-foreground">{assignee}</span>
        </div>

        {issue.dueDate && (
          <p className="text-xs text-muted-foreground">
            Due: {new Date(issue.dueDate).toLocaleDateString()}
          </p>
        )}

        {canEdit && (
          <select
            aria-label={`Change status for ${issue.title}`}
            value={issue.status}
            onChange={(event) =>
              onStatusChange(issue, event.target.value as Issue["status"])
            }
            onClick={(event) => event.stopPropagation()}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Done">Done</option>
          </select>
        )}
      </CardContent>
    </Card>
  );
};

export default IssueCard;
