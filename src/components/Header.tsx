import { useState } from "react";
import { Layers3, LogOut, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import ChangePasswordDialog from "@/components/auth/ChangePasswordDialog";
import ManageMembersDialog from "@/components/members/ManageMembersDialog";

interface DashboardHeaderProps {
  isAdmin: boolean;
  onLogout: () => void;
}

export default function Header({ isAdmin, onLogout }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleConfirmLogout = () => {
    setLogoutOpen(false);
    onLogout();
  };

  return (
    <header className="flex flex-col gap-4 border-b border-border/70 pb-5 lg:flex-row lg:items-center lg:justify-between">
      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Go to SprintDesk dashboard"
        className="flex w-fit items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Layers3 className="size-6" />
        </div>

        <span>
          <span className="block text-lg font-bold tracking-tight">
            SprintDesk
          </span>
          <span className="block text-xs text-muted-foreground">
            Project workspace
          </span>
        </span>
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <ChangePasswordDialog />

        {isAdmin && <ManageMembersDialog />}

        <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
          <AlertDialogTrigger>
            <Button variant="outline" className="gap-2 rounded-xl">
              <LogOut className="size-4" />
              Sign out
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="rounded-2xl sm:max-w-md">
            <AlertDialogHeader>
              <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-destructive/10">
                <ShieldAlert className="size-6 text-destructive" />
              </div>

              <AlertDialogTitle className="text-lg">
                Are you sure you want to sign out?
              </AlertDialogTitle>

              <AlertDialogDescription>
                You'll be signed out of SprintDesk and returned to the login
                page. Make sure you've saved any work before continuing.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="gap-2 sm:gap-2">
              <AlertDialogCancel className="rounded-xl">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleConfirmLogout}
                className="gap-2 rounded-xl bg-red-400 text-white hover:bg-destructive/90"
              >
                <LogOut className="size-4" />
                Yes, sign out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
