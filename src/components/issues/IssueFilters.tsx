import { priorityFilterOptions, statuses } from "@/constants/options";
import type { Project } from "@/store/api/types";

interface IssueFiltersProps {
  status: string;
  priority: string;
  assigneeId: string;
  sort: "newest" | "oldest" | "dueDate";
  project: Project;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
  onSortChange: (value: "newest" | "oldest" | "dueDate") => void;
}
const selectClass = "rounded-md border bg-background px-3 py-2 text-sm";
const IssueFilters = ({
  status,
  priority,
  assigneeId,
  sort,
  project,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onSortChange,
}: IssueFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        aria-label="Filter by status"
        className={selectClass}
      >
        <option value="">All statuses</option>
        {statuses.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      <select
        value={priority}
        onChange={(event) => onPriorityChange(event.target.value)}
        aria-label="Filter by priority"
        className={selectClass}
      >
        {priorityFilterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={assigneeId}
        onChange={(event) => onAssigneeChange(event.target.value)}
        aria-label="Filter by assignee"
        className={selectClass}
      >
        <option value="">All assignees</option>
        <option value="unassigned">Unassigned</option>

        {project.members.map((member) => (
          <option key={member._id} value={member._id}>
            {member.name}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(event) =>
          onSortChange(event.target.value as "newest" | "oldest" | "dueDate")
        }
        aria-label="Sort issues"
        className={selectClass}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="dueDate">Due date</option>
      </select>
    </div>
  );
};

export default IssueFilters;
