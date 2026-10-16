import type { Project } from "@/store/api/types";
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { FolderKanban } from "lucide-react";
import { useIsAdmin } from "@/store/selectors";
import CreateProjectDialog from "../Projects/CreateProjectDialog";
import ProjectCard from "./ProjectCard";
function ProjectList({ projects }: { projects: Project[] }) {
  const isAdmin = useIsAdmin();
  return (
    <section>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Your projects
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Select a project to view its board and activity.
          </p>
        </div>

        <span className="w-fit rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed border-border bg-background shadow-none">
          <CardHeader className="items-center px-5 py-12 text-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <FolderKanban className="size-7" />
            </div>

            <CardTitle className="mt-2">No projects yet</CardTitle>

            <CardDescription className="max-w-sm leading-6">
              {isAdmin
                ? "Create your first project to begin organizing work."
                : "Projects will appear here when an administrator adds you to one."}
            </CardDescription>

            {isAdmin && (
              <div className="pt-3">
                <CreateProjectDialog />
              </div>
            )}
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            return <ProjectCard key={project._id} project={project} />;
          })}
        </div>
      )}
    </section>
  );
}

export default ProjectList;
