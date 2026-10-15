import { useGetProjectsQuery } from "@/store/api/projects/query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import CreateProjectDialog from "@/components/Projects/CreateProjectDialog";
import { useIsAdmin } from "@/store/selectors";
import ManageMembersDialog from "@/components/members/ManageMembersDialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/authSlice";
import ChangePasswordDialog from "@/components/auth/ChangePasswordDialog";
import { api } from "@/store/api";

export default function Dashboard() {
  const { data, isLoading, isError } = useGetProjectsQuery();
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(api.util.resetApiState());

    navigate("/login", { replace: true });
  };

  if (isLoading) {
    return <div className="p-6">Loading projects...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load projects. Please try again.
      </div>
    );
  }

  const projects = data?.projects ?? [];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">SprintDesk</h1>
            <p className="mt-2 text-gray-600">
              Welcome back! Here are your projects.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ChangePasswordDialog />

            {isAdmin && (
              <>
                <ManageMembersDialog />
                <CreateProjectDialog />
              </>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-600">
                  {project.description || "No description provided."}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {project.members.length} members
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      project.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <p className="mt-8 text-gray-500">
            No projects found for your account.
          </p>
        )}
      </div>
    </main>
  );
}
