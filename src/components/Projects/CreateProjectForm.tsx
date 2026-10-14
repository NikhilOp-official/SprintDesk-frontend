import { Formik, Form } from "formik";
import { toast } from "sonner";
import {
  useCreateProjectMutation,
  useAddProjectMembersMutation,
} from "@/store/api/projects/mutation";
import { useGetAvailableMembersQuery } from "@/store/api/projects/query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { projectFormValidationSchema } from "./schemaValidation";
import ProjectForm from "./ProjectForm";

interface CreateProjectFormProps {
  onSuccess: () => void;
}

export default function CreateProjectForm({
  onSuccess,
}: CreateProjectFormProps) {
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [addProjectMembers, { isLoading: isAddingMembers }] =
    useAddProjectMembersMutation();

  const {
    data,
    isLoading: isLoadingMembers,
    isError: membersError,
  } = useGetAvailableMembersQuery();

  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        memberIds: [] as string[],
      }}
      validationSchema={projectFormValidationSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          const response = await createProject({
            name: values.name.trim(),
            description: values.description.trim(),
          }).unwrap();

          const projectId = response.project._id;

          if (values.memberIds.length > 0) {
            await addProjectMembers({
              projectId,
              memberIds: values.memberIds,
            }).unwrap();
          }

          toast.success("Project created successfully");
          resetForm();
          onSuccess();
        } catch {
          toast.error(
            "Project creation or member assignment failed. Please check your projects.",
          );
        }
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-4">
          <ProjectForm />

          <div className="space-y-2">
            <Label>Team members (optional)</Label>

            {isLoadingMembers ? (
              <p className="text-sm text-gray-500">Loading members...</p>
            ) : membersError ? (
              <p className="text-sm text-red-500">Unable to load members.</p>
            ) : data?.members.length ? (
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                {data.members.map((member) => (
                  <label
                    key={member._id}
                    className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={values.memberIds.includes(member._id)}
                      onChange={(event) => {
                        const nextIds = event.target.checked
                          ? [...values.memberIds, member._id]
                          : values.memberIds.filter((id) => id !== member._id);

                        setFieldValue("memberIds", nextIds);
                      }}
                    />

                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {member.name}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {member.email}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No members available.</p>
            )}

            <p className="text-xs text-gray-500">
              {values.memberIds.length} member(s) selected
            </p>
          </div>

          <Button
            type="submit"
            disabled={
              isSubmitting ||
              isCreating ||
              isAddingMembers ||
              isLoadingMembers ||
              membersError
            }
            className="w-full"
          >
            {isCreating || isAddingMembers
              ? "Creating project..."
              : "Create Project"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
