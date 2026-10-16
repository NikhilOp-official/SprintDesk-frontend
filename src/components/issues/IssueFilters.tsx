import {
  ArrowDownUp,
  CircleDot,
  Flag,
  UserRound,
  ListFilter,
} from "lucide-react";

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

const selectClass =
  "h-10 w-full appearance-none rounded-xl border border-input bg-background pl-9 pr-8 text-sm text-foreground outline-none transition-colors hover:bg-muted/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 sm:w-auto sm:min-w-[140px]";

const FilterSelect = ({
  icon: Icon,
  children,
  ...props
}: {
  icon: typeof CircleDot;
  children: React.ReactNode;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  "aria-label": string;
}) => (
  <div className="relative min-w-0 flex-1 sm:flex-none">
    <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

    <select className={selectClass} {...props}>
      {children}
    </select>

    <ListFilter className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
  </div>
);

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
    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
      <FilterSelect
        icon={CircleDot}
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {statuses.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        icon={Flag}
        value={priority}
        onChange={(event) => onPriorityChange(event.target.value)}
        aria-label="Filter by priority"
      >
        {priorityFilterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        icon={UserRound}
        value={assigneeId}
        onChange={(event) => onAssigneeChange(event.target.value)}
        aria-label="Filter by assignee"
      >
        <option value="">All assignees</option>
        <option value="unassigned">Unassigned</option>

        {project.members.map((member) => (
          <option key={member._id} value={member._id}>
            {member.name}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        icon={ArrowDownUp}
        value={sort}
        onChange={(event) =>
          onSortChange(event.target.value as "newest" | "oldest" | "dueDate")
        }
        aria-label="Sort issues"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="dueDate">Due date</option>
      </FilterSelect>
    </div>
  );
};

export default IssueFilters;
