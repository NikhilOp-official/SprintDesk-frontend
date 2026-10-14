import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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

interface CreateIssueDialogProps {
  projectId: string;
  projectStatus: "active" | "archived";
  onCreated?: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .max(120, "Title must be at most 120 characters")
    .required("Title is required"),
  description: Yup.string().max(
    2000,
    "Description must be at most 2000 characters",
  ),
  status: Yup.string()
    .oneOf(["To Do", "In Progress", "In Review", "Done"])
    .required(),
  priority: Yup.string().oneOf(["Low", "Medium", "High"]).required(),
  dueDate: Yup.string().nullable(),
});

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

export default function CreateIssueDialog({
  projectId,
  projectStatus,
  onCreated,
}: CreateIssueDialogProps) {
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

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
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
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium"
                >
                  Title
                </label>
                <Field
                  id="title"
                  name="title"
                  placeholder="e.g. Fix login validation"
                  className={inputClass}
                />
                <ErrorMessage
                  name="title"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium"
                >
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Describe the issue..."
                  className={inputClass}
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="status"
                    className="mb-1 block text-sm font-medium"
                  >
                    Status
                  </label>
                  <Field
                    id="status"
                    name="status"
                    as="select"
                    className={inputClass}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Done">Done</option>
                  </Field>
                </div>

                <div>
                  <label
                    htmlFor="priority"
                    className="mb-1 block text-sm font-medium"
                  >
                    Priority
                  </label>
                  <Field
                    id="priority"
                    name="priority"
                    as="select"
                    className={inputClass}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Field>
                </div>
                <div>
                  <label
                    htmlFor="assigneeId"
                    className="mb-1 block text-sm font-medium"
                  >
                    Assignee
                  </label>

                  <Field
                    as="select"
                    id="assigneeId"
                    name="assigneeId"
                    className={inputClass}
                    disabled={isLoadingProject}
                  >
                    <option value="">Unassigned</option>

                    {(projectData?.project.members ?? []).map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </Field>

                  {isLoadingProject && (
                    <p className="mt-1 text-sm text-gray-500">
                      Loading project members...
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="dueDate"
                  className="mb-1 block text-sm font-medium"
                >
                  Due date (optional)
                </label>
                <Field
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  className={inputClass}
                />
                <ErrorMessage
                  name="dueDate"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

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
