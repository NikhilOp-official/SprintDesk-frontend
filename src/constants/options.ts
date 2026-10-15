import type { SelectOption } from "@/components/common/SelectField";
import type { IssueStatus } from "@/store/api/issues/types";

export const statusOptions: SelectOption[] = [
  { label: "To Do", value: "To Do" },
  { label: "In Progress", value: "In Progress" },
  { label: "In Review", value: "In Review" },
  { label: "Done", value: "Done" },
];

export const priorityOptions: SelectOption[] = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export const priorityFilterOptions: SelectOption[] = [
  { label: "All priorities", value: "" },
  ...priorityOptions,
];
export const statuses: IssueStatus[] = [
  "To Do",
  "In Progress",
  "In Review",
  "Done",
];
