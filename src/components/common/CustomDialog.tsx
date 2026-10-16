import type { ReactElement, ReactNode } from "react";
import { Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CustomDialogProps {
  title: string;
  description?: string;
  trigger: ReactElement;
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CustomDialog({
  title,
  description,
  trigger,
  children,
  open,
  onOpenChange,
}: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={trigger} />

      <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto rounded-2xl p-0 sm:max-w-2xl">
        <DialogHeader className="space-y-0 border-b bg-muted/20 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background shadow-sm">
              <Sparkles className="size-5 text-primary" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <DialogTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
                {title}
              </DialogTitle>

              {description && (
                <DialogDescription className="max-w-lg text-sm leading-6">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-5 pt-1">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
