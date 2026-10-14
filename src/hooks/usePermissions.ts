import { useCurrentUser } from "@/store/selectors";
import type { Project } from "@/store/api/types";
import type { Issue } from "@/store/api/issues/types";

const getId = (value: string | { _id: string } | null | undefined) =>
  typeof value === "string" ? value : value?._id;

export function usePermissions() {
  const user = useCurrentUser();
  const isAdmin = user?.role === "admin";

  function isProjectOwner(project: Project) {
    return !!user && project.owner._id === user.id;
  }

  function isProjectMember(project: Project) {
    return !!user && project.members.some((member) => member._id === user.id);
  }

  function hasProjectAccess(project: Project) {
    return isProjectOwner(project) || isProjectMember(project);
  }

  function canCreateProject() {
    return isAdmin;
  }

  function canEditProject(project: Project) {
    return isAdmin && isProjectOwner(project) && project.status === "active";
  }

  function canManageProjectMembers(project: Project) {
    return canEditProject(project);
  }

  function canCreateIssue(project: Project) {
    if (!user || project.status !== "active") return false;

    return isAdmin ? isProjectOwner(project) : isProjectMember(project);
  }

  function canEditIssue(issue: Issue, project: Project) {
    if (!user || project.status !== "active") return false;

    if (isAdmin) {
      return isProjectOwner(project);
    }

    return (
      isProjectMember(project) &&
      (getId(issue.creatorId) === user.id ||
        getId(issue.assigneeId) === user.id)
    );
  }

  function canAssignIssue(project: Project) {
    return isAdmin && isProjectOwner(project) && project.status === "active";
  }

  function canDeleteIssue(project: Project) {
    return isAdmin && isProjectOwner(project) && project.status === "active";
  }

  return {
    hasProjectAccess,
    canCreateProject,
    canEditProject,
    canManageProjectMembers,
    canCreateIssue,
    canEditIssue,
    canAssignIssue,
    canDeleteIssue,
  };
}
