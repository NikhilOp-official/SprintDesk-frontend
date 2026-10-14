import InputField from "@/components/common/InputField";
import SelectField, {
  type SelectOption,
} from "@/components/common/SelectField";
import { Textarea } from "@/components/ui/textarea";
import { statusOptions, priorityOptions } from "@/constants/options";
import type { IssuePriority, IssueStatus } from "@/store/api/issues/types";

export interface IssueFormValues {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assigneeId: string;
  dueDate: string;
}

interface IssueFormProps {
  assigneeOptions: SelectOption[];
  disabled?: boolean;
  isLoadingAssignees?: boolean;
}

export default function IssueForm({
  assigneeOptions,
  disabled = false,
  isLoadingAssignees = false,
}: IssueFormProps) {
  return (
    <>
      <InputField
        label="Title"
        id="issue-title"
        name="title"
        placeholder="e.g. Fix login validation"
        disabled={disabled}
      />

      <InputField
        as={Textarea}
        label="Description"
        id="issue-description"
        name="description"
        rows={3}
        placeholder="Describe the issue..."
        disabled={disabled}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          label="Status"
          id="issue-status"
          name="status"
          options={statusOptions}
          disabled={disabled}
        />

        <SelectField
          label="Priority"
          id="issue-priority"
          name="priority"
          options={priorityOptions}
          disabled={disabled}
        />
      </div>

      <SelectField
        label="Assignee"
        id="issue-assignee"
        name="assigneeId"
        placeholder="Unassigned"
        options={assigneeOptions}
        disabled={disabled || isLoadingAssignees}
      />

      {isLoadingAssignees && (
        <p className="text-sm text-gray-500">Loading project members...</p>
      )}

      <InputField
        label="Due date (optional)"
        id="issue-due-date"
        name="dueDate"
        type="date"
        disabled={disabled}
      />
    </>
  );
}
