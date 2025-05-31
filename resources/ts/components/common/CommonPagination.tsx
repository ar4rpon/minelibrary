import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationProps {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  handlePageChange: (value: number) => void;
}

export function CommonPagination({
  totalPages,
  totalItems,
  currentPage,
  handlePageChange,
}: PaginationProps) {
  return (
    totalItems > 0 && (
      <Pagination className="mt-8">
        <PaginationContent>
          {currentPage > 1 && (
            <>
              <PaginationItem>
                <PaginationFirst
                  className="rounded-md bg-white px-3 py-2"
                  onClick={() => handlePageChange(1)}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  className="rounded-md bg-white px-3 py-2"
                  onClick={() =>
                    handlePageChange(Math.max(1, Number(currentPage) - 1))
                  }
                />
              </PaginationItem>
            </>
          )}
          <PaginationItem className="mx-4">
            <span>{currentPage}</span>
          </PaginationItem>
          {currentPage < totalPages && (
            <>
              <PaginationItem>
                <PaginationNext
                  className="rounded-md bg-white px-3 py-2"
                  onClick={() => handlePageChange(Number(currentPage) + 1)}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast
                  className="rounded-md bg-white px-3 py-2"
                  onClick={() => handlePageChange(totalPages)}
                />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    )
  );
}
