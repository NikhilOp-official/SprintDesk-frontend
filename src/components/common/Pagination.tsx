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
    <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
      <p className="text-sm text-muted-foreground">
        Showing {startItem}–{endItem} of {totalItems}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <Button
          type="button"
          variant="outline"
          disabled={page >= totalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
