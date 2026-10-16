import { useGetProjectsQuery } from "@/store/api/projects/query";
import { useNavigate } from "react-router-dom";
import CreateProjectDialog from "@/components/Projects/CreateProjectDialog";
import { useCurrentUser, useIsAdmin } from "@/store/selectors";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/authSlice";
import { api } from "@/store/api";
import Header from "@/components/Header";
import ProjectSummary from "@/components/dashboard/ProjectSummary";
import ErrorComponent from "@/components/common/ErrorComponent";
import ProjectList from "@/components/dashboard/ProjectList";

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useGetProjectsQuery();
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const user = useCurrentUser();
  const dispatch = useAppDispatch();

  const projects = data?.projects ?? [];

  const activeProjects = projects.filter(
    (project) => project.status === "active",
  ).length;

  const archivedProjects = projects.length - activeProjects;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(api.util.resetApiState());
    navigate("/login", { replace: true });
  };

  if (isLoading) {
    return (
      <main className="min-h-[60vh] bg-muted/20 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="h-36 rounded-2xl bg-muted" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-24 rounded-xl bg-muted" />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-52 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <ErrorComponent
        title="Projects could not load"
        description="Check your connection and try again."
        onTry={refetch}
      />
    );
  }

  const firstName = user?.name?.trim().split(/\s+/)[0];

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-5 text-foreground sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-7 sm:space-y-9">
        <Header isAdmin={isAdmin} onLogout={handleLogout} />

        {/* Welcome section */}
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">
              {isAdmin ? "Admin workspace" : "Member workspace"}
            </p>

            <h1 className="mt-2 break-words text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Welcome back{firstName ? `, ${firstName}` : ""}!
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage your projects, follow progress, and keep your team moving
              forward.
            </p>
          </div>

          {isAdmin && (
            <div className="w-full shrink-0 sm:w-fit">
              <CreateProjectDialog />
            </div>
          )}
        </section>

        <ProjectSummary
          active={activeProjects}
          archived={archivedProjects}
          total={projects.length}
        />

        <ProjectList projects={projects} />

        <footer className="border-t border-border/70 pt-5 text-xs text-muted-foreground">
          SprintDesk · Project and issue management
        </footer>
      </div>
    </main>
  );
}
