import { useState } from "react";
import { toast } from "sonner";
import CustomDialog from "@/components/common/CustomDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAvailableMembersQuery } from "@/store/api/projects/query";
import {
  useAddProjectMembersMutation,
  useRemoveProjectMemberMutation,
} from "@/store/api/projects/mutation";
import { usePermissions } from "@/hooks/usePermissions";
import type { Project } from "@/store/api/types";

interface ProjectMembersProps {
  project: Project;
}

export default function ProjectMembers({ project }: ProjectMembersProps) {
  const { canManageProjectMembers } = usePermissions();
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const canManage = canManageProjectMembers(project);

  const projectId = project._id;
  const members = project.members;

  const {
    data,
    isLoading: isLoadingMembers,
    isError: membersError,
  } = useGetAvailableMembersQuery(undefined, {
    skip: !canManage || !open,
  });
  const [addProjectMembers, { isLoading: isAdding }] =
    useAddProjectMembersMutation();

  const [removeProjectMember] = useRemoveProjectMemberMutation();

  const availableMembers = (data?.members ?? []).filter(
    (user) => !members.some((member) => member._id === user._id),
  );

  const handleAddMembers = async () => {
    if (selectedIds.length === 0) return;

    try {
      await addProjectMembers({
        projectId,
        memberIds: selectedIds,
      }).unwrap();

      toast.success("Members added successfully");
      setSelectedIds([]);
      setOpen(false);
    } catch {
      toast.error("Failed to add members");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeProjectMember({ projectId, userId }).unwrap();
      toast.success("Member removed successfully");
    } catch {
      toast.error("Failed to remove member");
    }
  };

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Team Members</h2>
          <p className="text-sm text-gray-500">{members.length} members</p>
        </div>

        {canManage && (
          <CustomDialog
            title="Add Team Members"
            description="Select the members you want to add to this project."
            trigger={<Button>Add Members</Button>}
            open={open}
            onOpenChange={(nextOpen) => {
              setOpen(nextOpen);
              if (!nextOpen) setSelectedIds([]);
            }}
          >
            <div className="space-y-4">
              {isLoadingMembers ? (
                <p className="text-sm text-gray-500">Loading members...</p>
              ) : membersError ? (
                <p className="text-sm text-red-500">
                  Failed to load available members.
                </p>
              ) : availableMembers.length === 0 ? (
                <p className="text-sm text-gray-500">
                  All available members are already assigned.
                </p>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {availableMembers.map((member) => (
                    <label
                      key={member._id}
                      className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(member._id)}
                        onChange={(event) => {
                          setSelectedIds((previous) =>
                            event.target.checked
                              ? [...previous, member._id]
                              : previous.filter((id) => id !== member._id),
                          );
                        }}
                      />

                      <div className="min-w-0">
                        <p className="font-medium">{member.name}</p>
                        <p className="truncate text-sm text-gray-500">
                          {member.email}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <Button
                className="w-full"
                disabled={
                  isAdding ||
                  selectedIds.length === 0 ||
                  isLoadingMembers ||
                  membersError
                }
                onClick={handleAddMembers}
              >
                {isAdding
                  ? "Adding Members..."
                  : `Add ${selectedIds.length || ""} Member${selectedIds.length === 1 ? "" : "s"}`}
              </Button>
            </div>
          </CustomDialog>
        )}
      </div>

      {members.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-sm text-gray-500">
            No members have been added to this project yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card key={member._id}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {member.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{member.name}</p>
                  <p className="truncate text-sm text-gray-500">
                    {member.email}
                  </p>
                </div>

                {canManage && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMember(member._id)}
                  >
                    Remove
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
