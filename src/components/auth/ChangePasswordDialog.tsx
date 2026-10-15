import { useState } from "react";
import CustomDialog from "../common/CustomDialog";
import { Button } from "../ui/button";
import ChangePasswordForm from "./ChangePasswordForm";

function ChangePasswordDialog() {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  return (
    <CustomDialog
      title="Change Password"
      description="Choose a new password for your account."
      open={passwordDialogOpen}
      onOpenChange={setPasswordDialogOpen}
      trigger={<Button variant="outline">Change Password</Button>}
    >
      <ChangePasswordForm onSuccess={() => setPasswordDialogOpen(false)} />
    </CustomDialog>
  );
}

export default ChangePasswordDialog;
