import { useState } from "react";
import { FolderPlus } from "lucide-react";

import CustomDialog from "@/components/common/CustomDialog";
import { Button } from "@/components/ui/button";
import CreateProjectForm from "./CreateProjectForm";

export default function CreateProjectDialog() {
  const [open, setOpen] = useState(false);

  return (
    <CustomDialog
      title="Create a new project"
      description="Set up your workspace and bring your team together."
      trigger={
        <Button className="h-10 gap-2 rounded-xl px-4 shadow-sm">
          <FolderPlus className="size-4" />
          Create project
        </Button>
      }
      open={open}
      onOpenChange={setOpen}
    >
      <CreateProjectForm onSuccess={() => setOpen(false)} />
    </CustomDialog>
  );
}
