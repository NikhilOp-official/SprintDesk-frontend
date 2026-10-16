import { Archive, FolderKanban, Users } from "lucide-react";
import EditProjectDialog from "./EditProjectDialog";
import type { Project } from "@/store/api/types";

interface ProjectDetailsHeaderProps {
  isActive: boolean;
  project: Project;
  canEdit: boolean;
}

function ProjectDetailsHeader({
  canEdit,
  isActive,
  project,
}: ProjectDetailsHeaderProps) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-border/70 bg-background p-5 shadow-sm sm:p-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <div className="hidden size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary sm:grid">
          <FolderKanban className="size-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isActive ? "bg-emerald-500" : "bg-muted-foreground"
                }`}
              />
              {project.status}
            </span>

            {!isActive && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Archive className="size-3.5" />
                Read-only project
              </span>
            )}
          </div>

          <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
            {project.name}
          </h1>

          <p className="mt-2 max-w-2xl break-words text-sm leading-6 text-muted-foreground sm:text-base">
            {project.description || "No description provided."}
          </p>

          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <Users className="size-4" />
            <span>Owned by</span>
            <span className="font-medium text-foreground">
              {project.owner.name}
            </span>
          </p>
        </div>
      </div>

      {canEdit && (
        <div className="w-full shrink-0 lg:w-fit">
          <EditProjectDialog
            status={project.status}
            projectId={project._id}
            name={project.name}
            description={project.description}
          />
        </div>
      )}
    </section>
  );
}

export default ProjectDetailsHeader;
