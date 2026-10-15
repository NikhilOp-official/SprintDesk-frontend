import { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomDialog from "@/components/common/CustomDialog";
import CreateMemberForm from "./CreateMemberForm";
import { useGetAvailableMembersQuery } from "@/store/api/projects/query";

export default function ManageMembersDialog() {
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isError } = useGetAvailableMembersQuery(undefined, {
    skip: !open,
  });

  return (
    <>
      <CustomDialog
        title="Manage Members"
        description="View workspace members and create new accounts."
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Button variant="outline" onClick={() => setOpen(true)}>
            Manage Members
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setCreateOpen(true)}>Create Member</Button>
          </div>

          {isLoading && <p>Loading members...</p>}

          {isError && (
            <p className="text-sm text-red-500">
              Failed to load members. Please try again.
            </p>
          )}

          {data?.members.length === 0 && (
            <p className="text-sm text-gray-500">No members found.</p>
          )}

          {data?.members.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                Member
              </span>
            </div>
          ))}
        </div>
      </CustomDialog>

      <CustomDialog
        title="Create Member"
        description="Create a member account with a temporary password."
        open={createOpen}
        onOpenChange={setCreateOpen}
        trigger={<span className="hidden" />}
      >
        <CreateMemberForm setCreateOpen={setCreateOpen} />
      </CustomDialog>
    </>
  );
}
