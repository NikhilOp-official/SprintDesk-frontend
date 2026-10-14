import { useState } from "react";

import CustomDialog from "@/components/common/CustomDialog";
import { Button } from "@/components/ui/button";
import EditProjectForm from "./EditProjectForm";
import type { ProjectStatus } from "./schemaValidation";

interface EditProjectDialogProps {
  projectId: string;
  name: string;
  description: string;
  status: ProjectStatus;
}

export default function EditProjectDialog({
  projectId,
  name,
  description,
  status,
}: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <CustomDialog
      title="Edit Project"
      description="Update your project details."
      trigger={<Button variant="outline">Edit Project</Button>}
      open={open}
      onOpenChange={setOpen}
    >
      <EditProjectForm
        status={status}
        projectId={projectId}
        name={name}
        description={description}
        onSuccess={() => setOpen(false)}
      />
    </CustomDialog>
  );
}
