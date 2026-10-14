import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

import { useUpdateProjectMutation } from "@/store/api/projects/mutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type ProjectStatus = "active" | "archived";
interface EditProjectFormProps {
  projectId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  onSuccess: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .required("Project name is required"),
  status: Yup.string()
    .oneOf(["active", "archived"])
    .required("Status is required"),
  description: Yup.string().max(
    500,
    "Description cannot exceed 500 characters",
  ),
});

export default function EditProjectForm({
  projectId,
  name,
  description,
  status,
  onSuccess,
}: EditProjectFormProps) {
  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  return (
    <Formik
      initialValues={{ name, description: description || "", status }}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values) => {
        try {
          await updateProject({
            projectId,
            name: values.name.trim(),
            description: values.description.trim(),
            status: values.status,
          }).unwrap();

          toast.success("Project updated successfully");
          onSuccess();
        } catch {
          toast.error("Failed to update project");
        }
      }}
    >
      {({
        isSubmitting,
        values,
        setFieldValue,
        touched,
        errors,
        handleBlur,
      }) => (
        <Form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-project-name">Project name</Label>
            <Field
              as={Input}
              id="edit-project-name"
              name="name"
              placeholder="Enter project name"
            />
            <ErrorMessage
              name="name"
              component="p"
              className="text-sm text-red-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-project-description">Description</Label>
            <Field
              as={Textarea}
              id="edit-project-description"
              name="description"
              placeholder="Describe your project"
            />
            <ErrorMessage
              name="description"
              component="p"
              className="text-sm text-red-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Project Status
            </label>

            <select
              id="status"
              name="status"
              value={values.status}
              onChange={(event) => setFieldValue("status", event.target.value)}
              onBlur={handleBlur}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>

            {touched.status && errors.status && (
              <p className="text-sm text-destructive">{errors.status}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
