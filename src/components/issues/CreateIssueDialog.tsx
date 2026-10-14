import { Formik, Form } from "formik";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateIssueMutation } from "@/store/api/issues/mutation";
import { useGetProjectByIdQuery } from "@/store/api/projects/query";
import type {
  CreateIssueRequest,
  IssuePriority,
  IssueStatus,
} from "@/store/api/issues/types";
import CustomDialog from "../common/CustomDialog";

import IssueForm, { type IssueFormValues } from "./IssueForm";
import { issueFormValidationSchema } from "./schemaValidation";
import { usePermissions } from "@/hooks/usePermissions";

interface CreateIssueDialogProps {
  projectId: string;
  projectStatus: "active" | "archived";
  onCreated?: () => void;
}

export default function CreateIssueDialog({
  projectId,
  projectStatus,
  onCreated,
}: CreateIssueDialogProps) {
  const { canAssignIssue } = usePermissions();
  const [open, setOpen] = useState(false);
  const [createIssue, { isLoading }] = useCreateIssueMutation();
  const { data: projectData, isLoading: isLoadingProject } =
    useGetProjectByIdQuery(projectId);

  const initialValues = {
    title: "",
    description: "",
    status: "To Do" as IssueStatus,
    priority: "Medium" as IssuePriority,
    assigneeId: "",
    dueDate: "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    helpers: { resetForm: () => void },
  ) => {
    const payload: CreateIssueRequest = {
      projectId,
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      priority: values.priority,
      assigneeId: values.assigneeId || null,
      dueDate: values.dueDate || null,
    };

    try {
      await createIssue(payload).unwrap();
      toast.success("Issue created successfully");
      helpers.resetForm();
      setOpen(false);
      onCreated?.();
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
          : "Failed to create issue";

      toast.error(message);
    }
  };

  if (projectStatus !== "active") {
    return null;
  }
  const assigneeOptions = (projectData?.project.members ?? []).map(
    (member) => ({
      label: `${member.name} (${member.email})`,
      value: member._id,
    }),
  );
  return (
    <div>
      <Formik<IssueFormValues>
        initialValues={initialValues}
        validationSchema={issueFormValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <CustomDialog
            title="Create issue"
            description="Add a new issue to this project."
            trigger={<Button type="button">Create issue</Button>}
            open={open}
            onOpenChange={setOpen}
          >
            <Form className="space-y-2">
              <IssueForm
                assigneeOptions={assigneeOptions}
                isLoadingAssignees={isLoadingProject}
                canAssign={
                  !!projectData?.project && canAssignIssue(projectData.project)
                }
              />

              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={isLoading || isSubmitting}>
                  {isLoading || isSubmitting ? "Creating..." : "Create issue"}
                </Button>
              </div>
            </Form>
          </CustomDialog>
        )}
      </Formik>
    </div>
  );
}
