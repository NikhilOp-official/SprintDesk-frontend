import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  pageSize?: number;
}

const Pagination = ({
  page,
  totalPages,
  totalItems,
  onPageChange,
  isLoading = false,
  pageSize = 10,
}: PaginationProps) => {
  if (totalItems === 0 || totalPages === 0) {
    return null;
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-center text-sm text-muted-foreground sm:text-left">
        Showing{" "}
        <span className="font-semibold text-foreground">{startItem}</span>
        {"–"}
        <span className="font-semibold text-foreground">{endItem}</span>
        {" of "}
        <span className="font-semibold text-foreground">{totalItems}</span>
        {" issues"}
      </p>

      <div className="flex items-center justify-center gap-2">
        <Button
          type="button"
          variant="default"
          size="sm"
          className="h-9 gap-1.5 rounded-xl px-3"
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="size-4" />
          <span>Previous</span>
        </Button>

        <div
          className="flex h-9 min-w-24 items-center justify-center rounded-xl border bg-card px-3 text-sm"
          aria-live="polite"
        >
          <span className="text-muted-foreground">Page</span>
          <span className="mx-1.5 font-semibold text-foreground">{page}</span>
          <span className="text-muted-foreground">of {totalPages}</span>
        </div>

        <Button
          type="button"
          variant="default"
          size="sm"
          className="h-9 gap-1.5 rounded-xl px-3"
          disabled={page >= totalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
          aria-label="Go to next page"
        >
          <span>Next</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
};

export default Pagination;
