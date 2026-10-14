import { Form, Formik } from "formik";
import { toast } from "sonner";
import CustomDialog from "@/components/common/CustomDialog";
import { Button } from "@/components/ui/button";
import { useGetIssueByIdQuery } from "@/store/api/issues/query";
import {
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} from "@/store/api/issues/mutation";
import { useGetProjectByIdQuery } from "@/store/api/projects/query";
import type { IssuePriority, IssueStatus } from "@/store/api/issues/types";
import ActivityHistory from "./ActivityHistory";
import IssueForm from "./IssueForm";
import { issueFormValidationSchema } from "./schemaValidation";
import { usePermissions } from "@/hooks/usePermissions";

interface IssueDetailsDialogProps {
  issueId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface IssueFormValues {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assigneeId: string;
  dueDate: string;
}

export default function IssueDetailsDialog({
  issueId,
  open,
  onOpenChange,
}: IssueDetailsDialogProps) {
  const { canDeleteIssue, canEditIssue, canAssignIssue } = usePermissions();

  const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation();
  const {
    data: issue,
    isLoading,
    isError,
  } = useGetIssueByIdQuery(issueId ?? "", {
    skip: !issueId || !open,
  });

  const handleDelete = async () => {
    if (!issueId || !projectId || !canDelete) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this issue? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      await deleteIssue({ id: issueId, projectId }).unwrap();

      toast.success("Issue deleted successfully");
      onOpenChange(false);
    } catch {
      toast.error("Unable to delete issue");
    }
  };

  const projectId = !issue
    ? undefined
    : typeof issue.projectId === "string"
      ? issue.projectId
      : issue.projectId._id;

  const { data: projectData, isLoading: isLoadingProject } =
    useGetProjectByIdQuery(projectId ?? "", {
      skip: !projectId || !open,
    });

  const [updateIssue, { isLoading: isSaving }] = useUpdateIssueMutation();

  const getId = (value: string | { _id: string } | null | undefined) =>
    typeof value === "string" ? value : value?._id;

  const canEdit =
    issue && projectData?.project
      ? canEditIssue(issue, projectData.project)
      : false;

  const canDelete = projectData ? canDeleteIssue(projectData.project) : false;

  const assigneeOptions = (projectData?.project.members ?? []).map(
    (member) => ({
      label: `${member.name} (${member.email})`,
      value: member._id,
    }),
  );

  const handleSave = async (values: IssueFormValues) => {
    if (!issueId) return;

    try {
      await updateIssue({
        id: issueId,
        title: values.title.trim(),
        description: values.description.trim(),
        status: values.status,
        priority: values.priority,
        assigneeId: values.assigneeId || null,
        dueDate: values.dueDate || null,
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
        <div className=" space-y-6 ">
          <Formik<IssueFormValues>
            initialValues={{
              title: issue.title,
              description: issue.description ?? "",
              status: issue.status,
              priority: issue.priority,
              assigneeId: getId(issue.assigneeId) ?? "",
              dueDate: issue.dueDate?.slice(0, 10) ?? "",
            }}
            validationSchema={issueFormValidationSchema}
            enableReinitialize
            onSubmit={handleSave}
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-4">
                <IssueForm
                  assigneeOptions={assigneeOptions}
                  isLoadingAssignees={isLoadingProject}
                  disabled={!canEdit || isSaving}
                  canAssign={
                    projectData && canAssignIssue(projectData?.project)
                  }
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  {canEdit && (
                    <Button
                      type="submit"
                      disabled={
                        isSaving ||
                        isSubmitting ||
                        isDeleting ||
                        !values.title.trim()
                      }
                    >
                      {isSaving ? "Saving..." : "Save changes"}
                    </Button>
                  )}

                  {canDelete && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting || isSaving || isSubmitting}
                    >
                      {isDeleting ? "Deleting..." : "Delete issue"}
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>

          <ActivityHistory issueId={issueId} open={open} />
        </div>
      )}
    </CustomDialog>
  );
}
