import { Link, useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "@/store/api/projects/query";
import { Card, CardContent } from "@/components/ui/card";
import ProjectMembers from "@/components/Projects/ProjectMembers";
import EditProjectDialog from "@/components/Projects/EditProjectDialog";
import IssueBoard from "@/components/issues/IssueBoard";
import IssueDetailsDialog from "@/components/issues/IssueDetailsDialog";
import { useState } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { useProjectSocket } from "@/hooks/useProjectSocket";

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  useProjectSocket(projectId);
  const { canEditProject } = usePermissions();
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);

  const { data, isLoading, isError, error } = useGetProjectByIdQuery(
    projectId!,
    { skip: !projectId },
  );

  if (isLoading) {
    return <div className="p-6">Loading project...</div>;
  }

  if (isError || !data) {
    console.error("Project API error:", error);
    const status = error && "status" in error ? error.status : undefined;
    const isForbidden = status === 403 || status === 404;
    return (
      <main className="p-6">
        <p className="text-red-600">
          {isForbidden
            ? "You no longer have access to this project."
            : "Failed to load project. Please try again."}
        </p>
        <Link to="/" className="mt-3 inline-block text-blue-600 underline">
          Back to projects
        </Link>
      </main>
    );
  }

  const { project, summary } = data;
  const canEdit = canEditProject(project);
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <Link to="/" className="text-sm text-blue-600 hover:underline">
          ← Back to projects
        </Link>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="mt-2 text-gray-600">
              {project.description || "No description provided."}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Status: {project.status} · Owner: {project.owner.name}
            </p>
          </div>

          {canEdit && (
            <EditProjectDialog
              status={data.project.status}
              projectId={project._id}
              name={project.name}
              description={project.description}
            />
          )}
        </div>
        {/* Team Members */}
        <ProjectMembers project={project} />

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <SummaryCard title="Total Issues" value={summary.totalIssues} />
          <SummaryCard title="To Do" value={summary.todo} />
          <SummaryCard title="In Progress" value={summary.inProgress} />
          <SummaryCard title="In Review" value={summary.inReview} />
          <SummaryCard title="Done" value={summary.done} />
        </div>

        <div className="mt-8">
          <IssueBoard
            project={project}
            onOpenIssue={(issue) => {
              setSelectedIssueId(issue._id);
              setIssueDialogOpen(true);
            }}
          />
        </div>
        <IssueDetailsDialog
          issueId={selectedIssueId}
          open={issueDialogOpen}
          onOpenChange={setIssueDialogOpen}
        />
      </div>
    </main>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
