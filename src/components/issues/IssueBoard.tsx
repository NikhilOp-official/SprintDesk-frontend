import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useGetProjectIssuesQuery } from "@/store/api/issues/query";
import { useUpdateIssueMutation } from "@/store/api/issues/mutation";
import type { Issue, IssueStatus } from "@/store/api/issues/types";
import IssueCard from "./IssueCard";
import CreateIssueDialog from "./CreateIssueDialog";
import { priorityFilterOptions } from "@/constants/options";
import { usePermissions } from "@/hooks/usePermissions";
import type { Project } from "@/store/api/types";

const columns: IssueStatus[] = ["To Do", "In Progress", "In Review", "Done"];

interface IssueBoardProps {
  project: Project;
  onOpenIssue: (issue: Issue) => void;
}

const IssueBoard = ({ project, onOpenIssue }: IssueBoardProps) => {
  const { canCreateIssue, canEditIssue } = usePermissions();
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useGetProjectIssuesQuery({
    projectId: project?._id,
    page,
    limit: 100,
    search,
    priority: priority || undefined,
    sort: "newest",
  });

  const [updateIssue] = useUpdateIssueMutation();

  const canCreate = canCreateIssue(project);

  const handleStatusChange = async (issue: Issue, status: IssueStatus) => {
    if (status === issue.status) return;

    try {
      await updateIssue({ id: issue._id, status }).unwrap();
      toast.success("Issue status updated");
    } catch {
      toast.error("Unable to update issue status");
    }
  };

  if (isLoading) {
    return <p className="py-8 text-center">Loading issues...</p>;
  }

  if (isError) {
    return (
      <div className="space-y-3 py-8 text-center">
        <p>Unable to load issues.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const issues = data?.issues ?? [];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search issues..."
            aria-label="Search issues"
            className="rounded-md border bg-background px-3 py-2 text-sm"
          />

          <select
            value={priority}
            onChange={(event) => {
              setPriority(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by priority"
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            {priorityFilterOptions?.map((option) => (
              <option
                key={option?.value}
                id={option?.value}
                value={option?.value}
              >
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {canCreate && (
          <CreateIssueDialog
            projectId={project?._id}
            projectStatus={project?.status}
          />
        )}
      </div>

      {issues.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="font-medium">No issues found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try changing the filters or create an issue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((status) => {
            const columnIssues = issues.filter(
              (issue) => issue.status === status,
            );

            return (
              <section
                key={status}
                className="min-w-0 rounded-lg bg-muted/40 p-3"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="font-semibold">{status}</h3>
                  <span className="rounded-full bg-background px-2 py-0.5 text-xs">
                    {columnIssues.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {columnIssues.map((issue) => (
                    <IssueCard
                      key={issue._id}
                      issue={issue}
                      onOpen={onOpenIssue}
                      onStatusChange={handleStatusChange}
                      canEdit={canEditIssue(issue, project)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default IssueBoard;
