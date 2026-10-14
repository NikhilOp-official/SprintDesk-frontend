import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useGetProjectIssuesQuery } from "@/store/api/issues/query";
import { useUpdateIssueMutation } from "@/store/api/issues/mutation";
import type { Issue, IssueStatus } from "@/store/api/issues/types";
import IssueCard from "./IssueCard";
import { useCurrentUser, useIsAdmin } from "@/store/selectors";
import CreateIssueDialog from "./CreateIssueDialog";

const columns: IssueStatus[] = ["To Do", "In Progress", "In Review", "Done"];

interface IssueBoardProps {
  projectId: string;
  projectStatus: "active" | "archived";
  onOpenIssue: (issue: Issue) => void;
}

const IssueBoard = ({
  projectId,
  projectStatus,
  onOpenIssue,
}: IssueBoardProps) => {
  const isAdmin = useIsAdmin();
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useGetProjectIssuesQuery({
    projectId,
    page,
    limit: 100,
    search,
    priority: priority || undefined,
    sort: "newest",
  });

  const [updateIssue, { isLoading: isUpdating }] = useUpdateIssueMutation();

  const canManage = projectStatus === "active";

  const currentUser = useCurrentUser();

  const getId = (value: string | { _id: string } | null | undefined) =>
    typeof value === "string" ? value : value?._id;

  const canEditIssue = (issue: Issue) =>
    canManage &&
    (isAdmin ||
      getId(issue.creatorId) === currentUser?.id ||
      getId(issue.assigneeId) === currentUser?.id);

  const handleStatusChange = async (issue: Issue, status: IssueStatus) => {
    if (status === issue.status) return;

    try {
      await updateIssue({ id: issue._id, status }).unwrap();
      toast.success("Issue status updated");
    } catch (error) {
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
            <option value="">All priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {canManage && (
          <CreateIssueDialog
            projectId={projectId}
            projectStatus={projectStatus}
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
                      canEdit={canEditIssue(issue)}
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
