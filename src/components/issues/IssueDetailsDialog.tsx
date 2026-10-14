import { useEffect, useState } from "react";
import { toast } from "sonner";

import CustomDialog from "@/components/common/CustomDialog";
import { Button } from "@/components/ui/button";
import {
  useGetIssueByIdQuery,
  useGetIssueActivityQuery,
} from "@/store/api/issues/query";
import {
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} from "@/store/api/issues/mutation";
import { useGetProjectByIdQuery } from "@/store/api/projects/query";
import { useCurrentUser, useIsAdmin } from "@/store/selectors";

import type { IssuePriority, IssueStatus } from "@/store/api/issues/types";

interface IssueDetailsDialogProps {
  issueId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectStatus: "active" | "archived";
}

const statuses: IssueStatus[] = ["To Do", "In Progress", "In Review", "Done"];
const priorities: IssuePriority[] = ["Low", "Medium", "High"];

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

export default function IssueDetailsDialog({
  issueId,
  open,
  onOpenChange,
  projectStatus,
}: IssueDetailsDialogProps) {
  const isAdmin = useIsAdmin();
  const currentUser = useCurrentUser();
  const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation();
  const {
    data: issue,
    isLoading,
    isError,
  } = useGetIssueByIdQuery(issueId ?? "", {
    skip: !issueId || !open,
  });

  const handleDelete = async () => {
    if (!issueId || !projectId || !isAdmin) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this issue? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      await deleteIssue({ id: issueId, projectId }).unwrap();

      toast.success("Issue deleted successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Unable to delete issue");
    }
  };

  const { data: activityData, isLoading: isLoadingActivity } =
    useGetIssueActivityQuery(issueId ?? "", {
      skip: !issueId || !open,
    });

  const projectId =
    issue && typeof issue.projectId === "object"
      ? issue.projectId._id
      : issue?.projectId;

  const { data: projectData } = useGetProjectByIdQuery(projectId ?? "", {
    skip: !projectId || !open,
  });

  const [updateIssue, { isLoading: isSaving }] = useUpdateIssueMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<IssueStatus>("To Do");
  const [priority, setPriority] = useState<IssuePriority>("Medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!issue) return;

    setTitle(issue.title);
    setDescription(issue.description ?? "");
    setStatus(issue.status);
    setPriority(issue.priority);
    setAssigneeId(
      issue.assigneeId && typeof issue.assigneeId !== "string"
        ? issue.assigneeId._id
        : (issue.assigneeId ?? ""),
    );
    setDueDate(issue.dueDate ? issue.dueDate.slice(0, 10) : "");
  }, [issue]);

  const getId = (value: string | { _id: string } | null | undefined) =>
    typeof value === "string" ? value : value?._id;

  const canEdit =
    projectStatus === "active" &&
    !!issue &&
    (isAdmin ||
      getId(issue.creatorId) === currentUser?.id ||
      getId(issue.assigneeId) === currentUser?.id);

  const handleSave = async () => {
    if (!issueId || !title.trim()) {
      toast.error("Issue title is required");
      return;
    }

    try {
      await updateIssue({
        id: issueId,
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assigneeId: assigneeId || null,
        dueDate: dueDate || null,
      }).unwrap();

      toast.success("Issue updated successfully");
      onOpenChange(false);
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Unable to update issue";

      toast.error(message);
    }
  };

  return (
    <CustomDialog
      title="Issue details"
      description="View and update issue information and activity."
      trigger={<span />}
      open={open}
      onOpenChange={onOpenChange}
    >
      {!issueId ? (
        <p className="text-sm text-gray-500">No issue selected.</p>
      ) : isLoading ? (
        <p className="py-6 text-sm text-gray-500">Loading issue...</p>
      ) : isError || !issue ? (
        <p className="py-6 text-sm text-red-600">
          Failed to load issue details.
        </p>
      ) : (
        <div className="max-h-[70vh] space-y-6 overflow-y-auto pr-1">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="issue-title"
                className="mb-1 block text-sm font-medium"
              >
                Title
              </label>
              <input
                id="issue-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={!canEdit || isSaving}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="issue-description"
                className="mb-1 block text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="issue-description"
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                disabled={!canEdit || isSaving}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="issue-status"
                  className="mb-1 block text-sm font-medium"
                >
                  Status
                </label>
                <select
                  id="issue-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as IssueStatus)
                  }
                  disabled={!canEdit || isSaving}
                  className={inputClass}
                >
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="issue-priority"
                  className="mb-1 block text-sm font-medium"
                >
                  Priority
                </label>
                <select
                  id="issue-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value as IssuePriority)
                  }
                  disabled={!canEdit || isSaving}
                  className={inputClass}
                >
                  {priorities.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="issue-assignee"
                className="mb-1 block text-sm font-medium"
              >
                Assignee
              </label>
              <select
                id="issue-assignee"
                value={assigneeId}
                onChange={(event) => setAssigneeId(event.target.value)}
                disabled={!canEdit || isSaving}
                className={inputClass}
              >
                <option value="">Unassigned</option>
                {(projectData?.project.members ?? []).map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
              {!projectData && (
                <p className="mt-1 text-xs text-gray-500">
                  Loading project members...
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="issue-due-date"
                className="mb-1 block text-sm font-medium"
              >
                Due date
              </label>
              <input
                id="issue-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                disabled={!canEdit || isSaving}
                className={inputClass}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {canEdit && (
                <Button
                  onClick={handleSave}
                  disabled={isSaving || isDeleting || !title.trim()}
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              )}

              {isAdmin && projectStatus === "active" && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || isSaving}
                >
                  {isDeleting ? "Deleting..." : "Delete issue"}
                </Button>
              )}
            </div>
          </div>

          <section className="border-t pt-4">
            <h3 className="mb-3 font-semibold">Activity history</h3>

            {isLoadingActivity ? (
              <p className="text-sm text-gray-500">Loading activity...</p>
            ) : !activityData?.activity?.length ? (
              <p className="text-sm text-gray-500">No activity recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {activityData.activity.map((entry) => (
                  <div key={entry._id} className="rounded-md border p-3">
                    <p className="text-sm font-medium">
                      {entry.actorId?.name ?? "A user"} updated the issue
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {entry.changes.map((change, index) => (
                        <li key={`${entry._id}-${change.field}-${index}`}>
                          <span className="font-medium">{change.field}</span>:{" "}
                          {String(change.from ?? "None")} →{" "}
                          {String(change.to ?? "None")}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </CustomDialog>
  );
}
