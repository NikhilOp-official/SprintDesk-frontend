export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "member";
  };
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: "active" | "archived";
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  members: {
    _id: string;
    name: string;
    email: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  count: number;
  projects: Project[];
}

export interface ProjectDetailsResponse {
  project: Project;
  // issues: {
  //   _id: string;
  //   title: string;
  //   description: string;
  //   status: "To Do" | "In Progress" | "In Review" | "Done";
  //   priority: "Low" | "Medium" | "High";
  //   creatorId: string;
  //   assigneeId: string | null;
  //   dueDate?: string;
  // }[];
  summary: {
    totalIssues: number;
    todo: number;
    inProgress: number;
    inReview: number;
    done: number;
  };
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  projectId: string;
  name?: string;
  description?: string;
  status?: "active" | "archived";
}

export interface ProjectMembersRequest {
  projectId: string;
  memberIds: string[];
}

export interface ProjectMemberRequest {
  projectId: string;
  userId: string;
}
export interface Member {
  _id: string;
  name: string;
  email: string;
}

export interface MembersResponse {
  count: number;
  members: Member[];
}
