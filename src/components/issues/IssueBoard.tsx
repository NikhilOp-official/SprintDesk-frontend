import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetProjectIssuesQuery } from "@/store/api/issues/query";
import type { Issue, IssueStatus } from "@/store/api/issues/types";
import CreateIssueDialog from "./CreateIssueDialog";
import { usePermissions } from "@/hooks/usePermissions";
import type { Project } from "@/store/api/types";
import Pagination from "../common/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import IssueFilters from "./IssueFilters";
import IssuesColumn from "./IssuesColumn";

const columns: IssueStatus[] = ["To Do", "In Progress", "In Review", "Done"];

const PAGE_SIZE = 10;

interface IssueBoardProps {
  project: Project;
  onOpenIssue: (issue: Issue) => void;
}

const IssueBoard = ({ project, onOpenIssue }: IssueBoardProps) => {
  const { canCreateIssue } = usePermissions();

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

  const canCreate = canCreateIssue(project);
  const issues = data?.issues ?? [];

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-11 w-full animate-pulse rounded-xl bg-muted sm:max-w-sm" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => (
            <div
              key={column}
              className="min-h-64 animate-pulse rounded-2xl border bg-muted/30 p-4"
            >
              <div className="mb-5 h-5 w-28 rounded bg-muted" />
              <div className="space-y-3">
                <div className="h-28 rounded-xl bg-muted" />
                <div className="h-24 rounded-xl bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-5 py-14 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-muted">
          <Search className="size-5 text-muted-foreground" />
        </div>

        <h3 className="font-semibold">Couldn't load issues</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Something went wrong while fetching this project's issues.
        </p>

        <Button variant="outline" className="mt-5" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      {/* Board toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search issues..."
              aria-label="Search issues"
              className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
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

            {canCreate && (
              <CreateIssueDialog
                projectId={project._id}
                projectStatus={project.status}
              />
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          {/* <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {data?.pagination.total ?? 0}
            </span>{" "}
            issues in this project
          </p> */}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isFetching && (
              <>
                <span className="size-2 animate-pulse rounded-full bg-primary" />
                Updating issues...
              </>
            )}
          </div>
        </div>
      </div>

      {/* Issue board */}
      {issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-5 py-14 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Search className="size-6 text-primary" />
          </div>

          <h3 className="font-semibold">No issues found</h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {search || status || priority || assigneeId
              ? "Try adjusting your search or filters to find what you're looking for."
              : "There are no issues on this page yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => {
            return (
              <IssuesColumn
                column={column}
                issues={issues}
                onOpenIssue={onOpenIssue}
                project={project}
                key={column}
              />
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
