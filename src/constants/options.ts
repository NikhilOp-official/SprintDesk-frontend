import type { SelectOption } from "@/components/common/SelectField";

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
