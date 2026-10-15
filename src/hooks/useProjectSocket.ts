import { useEffect } from "react";
import { api } from "@/store/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { createProjectSocket } from "@/lib/socket";

interface ProjectSocketPayload {
  projectId: string;
  issue?: { _id: string };
}

export function useProjectSocket(projectId: string | undefined) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token || !projectId) return;

    const socket = createProjectSocket(token);

    socket.on("connect", () => {
      socket.emit(
        "project:join",
        { projectId },
        (result: { success: boolean; message?: string }) => {
          if (!result.success) {
            console.error("Could not join project room:", result.message);
          }
        },
      );
    });

    socket.on("project:memberRemoved", ({ projectId: changedProjectId }) => {
      if (changedProjectId !== projectId) return;

      dispatch(api.util.invalidateTags([{ type: "Projects" }]));
    });

    const handleIssueChange = (payload: ProjectSocketPayload) => {
      if (payload.projectId !== projectId) return;

      // Refetch project issues and any open issue details/activity.
      dispatch(
        api.util.invalidateTags([
          { type: "Issues", id: projectId },
          { type: "Projects", id: projectId },
          ...(payload.issue?._id
            ? [
                { type: "Issue" as const, id: payload.issue._id },
                { type: "IssueActivity" as const, id: payload.issue._id },
              ]
            : []),
        ]),
      );
    };

    socket.on("issue:created", handleIssueChange);
    socket.on("issue:statusChanged", handleIssueChange);
    socket.on("issue:assigneeChanged", handleIssueChange);

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [dispatch, projectId, token]);
}
