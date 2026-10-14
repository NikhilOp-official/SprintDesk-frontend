import { useState } from "react";

import CustomDialog from "@/components/common/CustomDialog";
import { Button } from "@/components/ui/button";
import CreateProjectForm from "./CreateProjectForm";

export default function CreateProjectDialog() {
  const [open, setOpen] = useState(false);

  return (
    <CustomDialog
      title="Create Project"
      description="Enter the details for your new project."
      trigger={<Button>Create Project</Button>}
      open={open}
      onOpenChange={setOpen}
    >
      <CreateProjectForm onSuccess={() => setOpen(false)} />
    </CustomDialog>
  );
}
