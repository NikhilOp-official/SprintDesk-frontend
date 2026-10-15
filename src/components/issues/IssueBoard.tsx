import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useGetProjectIssuesQuery } from "@/store/api/issues/query";
import { useUpdateIssueMutation } from "@/store/api/issues/mutation";
import type { Issue, IssueStatus } from "@/store/api/issues/types";
import IssueCard from "./IssueCard";
import CreateIssueDialog from "./CreateIssueDialog";
import { usePermissions } from "@/hooks/usePermissions";
import type { Project } from "@/store/api/types";
import Pagination from "../common/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import IssueFilters from "./IssueFilters";

const columns: IssueStatus[] = ["To Do", "In Progress", "In Review", "Done"];
const PAGE_SIZE = 10;

interface IssueBoardProps {
  project: Project;
  onOpenIssue: (issue: Issue) => void;
}

const IssueBoard = ({ project, onOpenIssue }: IssueBoardProps) => {
  const { canCreateIssue, canEditIssue } = usePermissions();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 350);
  const [status, setStatus] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "dueDate">("newest");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetProjectIssuesQuery({
      projectId: project._id,
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      status: status || undefined,
      priority: priority || undefined,
      assigneeId: assigneeId || undefined,
      sort,
    });

  const [updateIssue] = useUpdateIssueMutation();

  const canCreate = canCreateIssue(project);
  const issues = data?.issues ?? [];

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

          <IssueFilters
            assigneeId={assigneeId}
            onAssigneeChange={(value) => {
              setAssigneeId(value);
              setPage(1);
            }}
            onPriorityChange={(value) => {
              setPriority(value);
              setPage(1);
            }}
            onSortChange={(value) => {
              setSort(value);
              setPage(1);
            }}
            onStatusChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            priority={priority}
            project={project}
            sort={sort}
            status={status}
          />
        </div>

        {canCreate && (
          <CreateIssueDialog
            projectId={project._id}
            projectStatus={project.status}
          />
        )}
      </div>

      {isFetching && !isLoading && (
        <p className="text-sm text-muted-foreground">Updating issues...</p>
      )}

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

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        totalPages={data?.pagination.totalPages ?? 0}
        totalItems={data?.pagination.total ?? 0}
        onPageChange={setPage}
        isLoading={isFetching}
      />
    </section>
  );
};

export default IssueBoard;
