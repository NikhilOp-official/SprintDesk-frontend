import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FolderKanban, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface ErrorComponentProps {
  title: string;
  description: string;
  onTry?: () => void;
}

function ErrorComponent({ description, title, onTry }: ErrorComponentProps) {
  return (
    <main className="grid min-h-[60vh] place-items-center bg-muted/20 p-4 sm:p-6">
      <Card className="w-full max-w-md border-border/70 shadow-sm">
        <CardHeader className="items-center text-center">
          <div className="grid size-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <FolderKanban className="size-6" />
          </div>

          <CardTitle className="mt-2">{title}</CardTitle>

          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          <Button onClick={() => onTry && void onTry()} className="gap-2">
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default ErrorComponent;
