import type { Project } from "@/store/api/types";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowUpRight, FolderKanban, UsersRound } from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";

function ProjectCard({ project }: { project: Project }) {
  const isActive = project.status === "active";
  const navigate = useNavigate();
  return (
    <button
      key={project._id}
      type="button"
      onClick={() => navigate(`/projects/${project._id}`)}
      aria-label={`Open project ${project.name}`}
      className="group flex min-w-0 w-full rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
    >
      <Card className="relative flex h-full min-w-0 w-full flex-col gap-0 overflow-hidden border-border/80 bg-background py-0 shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-md">
        <div
          className={`h-1 w-full ${
            isActive ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        />

        <CardHeader className="flex-1 gap-4 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <FolderKanban className="size-5" />
            </span>

            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
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
          </div>

          <div className="min-w-0">
            <CardTitle className="break-words text-base font-semibold tracking-tight transition-colors group-hover:text-primary sm:text-lg">
              {project.name}
            </CardTitle>

            <CardDescription className="mt-2 line-clamp-2 min-h-10 break-words text-sm leading-5">
              {project.description || "No description provided."}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="border-t border-border/70 px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <UsersRound className="size-4 shrink-0" />
              {project.members?.length ?? 0}{" "}
              {(project.members?.length ?? 0) === 1 ? "member" : "members"}
            </span>

            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary cursor-pointer">
              Open project
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Updated {formatDate(project.updatedAt)}
          </p>
        </CardContent>
      </Card>
    </button>
  );
}

export default ProjectCard;
