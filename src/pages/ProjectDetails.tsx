import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useGetProjectByIdQuery } from "@/store/api/projects/query";
import { Button } from "@/components/ui/button";
import ProjectMembers from "@/components/Projects/ProjectMembers";
import IssueBoard from "@/components/issues/IssueBoard";
import IssueDetailsDialog from "@/components/issues/IssueDetailsDialog";
import { usePermissions } from "@/hooks/usePermissions";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import ErrorComponent from "@/components/common/ErrorComponent";
import ProjectDetailsHeader from "@/components/Projects/ProjectDetailsHeader";
import IssueSummary from "@/components/issues/IssueSummary";

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();

  useProjectSocket(projectId);

  const { canEditProject } = usePermissions();

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } = useGetProjectByIdQuery(
    projectId!,
    {
      skip: !projectId,
    },
  );

  if (isLoading) {
    return (
      <main className="min-h-[60vh] bg-muted/20 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-7">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="h-28 rounded-2xl bg-muted" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-24 rounded-xl bg-muted" />
            ))}
          </div>

          <div className="h-64 rounded-2xl bg-muted" />
        </div>
      </main>
    );
  }

  if (isError || !data) {
    const status = error && "status" in error ? error.status : undefined;

    const isForbidden = status === 403 || status === 404;

    return (
      <>
        <ErrorComponent
          title={isForbidden ? "Project unavailable" : "Unable to load project"}
          description={
            isForbidden
              ? "You may no longer have access to this project."
              : "Something went wrong while loading the project. Please try again."
          }
        />
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {!isForbidden && (
            <Button variant="outline" onClick={() => void refetch()}>
              Try again
            </Button>
          )}

          <Button variant="default">
            <Link to="/">
              <ArrowLeft className="size-4" />
              Back to projects
            </Link>
          </Button>
        </div>
      </>
    );
  }

  const { project, summary } = data;
  const canEdit = canEditProject(project);
  const isActive = project.status === "active";

  const openIssue = (issue: { _id: string }) => {
    setSelectedIssueId(issue._id);
    setIssueDialogOpen(true);
  };

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-5 text-foreground sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-7 sm:space-y-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to projects
        </Link>

        <ProjectDetailsHeader
          canEdit={canEdit}
          isActive={isActive}
          project={project}
        />

        <section>
          <ProjectMembers project={project} />
        </section>

        <IssueSummary summary={summary} />

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">Issues</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage issues across each workflow status.
            </p>
          </div>

          <IssueBoard project={project} onOpenIssue={openIssue} />
        </section>

        <footer className="border-t border-border/70 pt-5 text-xs text-muted-foreground">
          SprintDesk · Project and issue management
        </footer>
      </div>

      <IssueDetailsDialog
        issueId={selectedIssueId}
        open={issueDialogOpen}
        onOpenChange={setIssueDialogOpen}
      />
    </main>
  );
}
