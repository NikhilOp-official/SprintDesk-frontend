import { Formik, Form } from "formik";
import { toast } from "sonner";
import { Check, LoaderCircle, Users, UserRound } from "lucide-react";

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

  const isSubmitting = isCreating || isAddingMembers;

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
      {({ values, setFieldValue }) => (
        <Form className="space-y-6">
          {/* Project details */}
          <ProjectForm />

          {/* Team member selection */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <Label className="text-sm font-semibold">
                  Team members
                  <span className="ml-1 font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>

                <p className="text-sm text-muted-foreground">
                  Choose who can collaborate on this project.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Users className="size-3.5" />
                {values.memberIds.length} selected
              </span>
            </div>

            {isLoadingMembers ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed py-8 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                Loading team members...
              </div>
            ) : membersError ? (
              <div
                role="alert"
                className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
              >
                Unable to load team members. Please try again later.
              </div>
            ) : data?.members.length ? (
              <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border bg-background p-2">
                {data.members.map((member) => {
                  const selected = values.memberIds.includes(member._id);

                  return (
                    <label
                      key={member._id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                        selected
                          ? "border-primary/40 bg-primary/5"
                          : "border-transparent hover:border-border hover:bg-muted/40"
                      } ${isSubmitting ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={isSubmitting}
                        onChange={(event) => {
                          const nextIds = event.target.checked
                            ? [...values.memberIds, member._id]
                            : values.memberIds.filter(
                                (id) => id !== member._id,
                              );

                          setFieldValue("memberIds", nextIds);
                        }}
                        className="size-4 shrink-0 accent-primary"
                      />

                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                        {member.name.trim().charAt(0).toUpperCase()}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {member.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {member.email}
                        </span>
                      </span>

                      {selected && (
                        <Check
                          className="size-4 shrink-0 text-primary"
                          aria-label="Selected"
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-xl border border-dashed px-4 py-8 text-center">
                <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-muted">
                  <UserRound className="size-5 text-muted-foreground" />
                </span>

                <p className="text-sm font-medium">No members available</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  You can create the project and add members later.
                </p>
              </div>
            )}
          </section>

          {/* Submit action */}
          <div className="border-t pt-4">
            <Button
              type="submit"
              disabled={
                isSubmitting || isLoadingMembers || membersError === true
              }
              className="h-11 w-full gap-2 rounded-xl shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Creating project...
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  Create project
                </>
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
