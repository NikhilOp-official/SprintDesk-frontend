export type IssueStatus = "To Do" | "In Progress" | "In Review" | "Done";

export type IssuePriority = "Low" | "Medium" | "High";

export interface IssueUser {
  _id: string;
  name: string;
  email: string;
}

export interface IssueProject {
  _id: string;
  name: string;
  status: "active" | "archived";
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  projectId: string | IssueProject;
  status: IssueStatus;
  priority: IssuePriority;
  creatorId: string | IssueUser;
  assigneeId: string | IssueUser | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IssueListResponse {
  issues: Issue[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateIssueRequest {
  projectId: string;
  title: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface UpdateIssueRequest {
  id: string;
  title?: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export interface IssueActivityChange {
  field: "status" | "assigneeId" | "priority";
  from: unknown;
  to: unknown;
}

export interface IssueActivity {
  _id: string;
  issueId: string;
  actorId: IssueUser;
  changes: IssueActivityChange[];
  createdAt: string;
  updatedAt: string;
}

export interface IssueActivityResponse {
  count: number;
  activity: IssueActivity[];
}
