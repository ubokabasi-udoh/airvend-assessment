import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Column<K extends string = string> = {
  key: K;
  label: string;
  render?: (value: React.ReactNode, row: any) => React.ReactNode;
};

type ColumnKey<H extends readonly Column[]> = H[number]["key"];

type RowFor<H extends readonly Column[]> = {
  [K in ColumnKey<H>]: React.ReactNode;
};

type SimpleTableProps<H extends readonly Column[]> = {
  headers: H;
  rowList: readonly RowFor<H>[];
  onRowClick?: (row: RowFor<H>) => void;
  page?: number;
  pageSize?: number;
  currentPage?: number;
  onClick?: (page: number) => void;
  onIncrease?: () => void;
  onDecrease?: () => void;
};

export default function SimpleTable<const H extends readonly Column[]>({
  headers,
  rowList,
  onRowClick,
  page = 1,
  pageSize = 4,
  currentPage,
  onClick,
  onIncrease,
  onDecrease,
}: SimpleTableProps<H>) {
  const [internalPage, setInternalPage] = React.useState(page);

  const activePage = currentPage ?? internalPage;
  const totalPages = Math.max(1, Math.ceil(rowList.length / pageSize));

  const safePage = Math.min(Math.max(activePage, 1), totalPages);

  const setPage = (nextPage: number) => {
    const next = Math.min(Math.max(nextPage, 1), totalPages);

    if (currentPage === undefined) {
      setInternalPage(next);
    }

    onClick?.(next);
  };

  const startIndex = (safePage - 1) * pageSize;
  const visibleRows = rowList.slice(startIndex, startIndex + pageSize);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set<number>([
      1,
      totalPages,
      safePage,
      safePage - 1,
      safePage + 1,
    ]);

    return [...pages]
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b)
      .reduce<(number | "ellipsis")[]>((result, n, i, arr) => {
        if (i > 0 && n - arr[i - 1] > 1) {
          result.push("ellipsis");
        }
        result.push(n);
        return result;
      }, []);
  };

  const previousDisabled = safePage <= 1;
  const nextDisabled = safePage >= totalPages;

  function renderCell<H extends readonly Column[]>(
    header: H[number],
    row: RowFor<H>,
  ): React.ReactNode {
    const key = header.key as ColumnKey<H>;
    const value = row[key];

    return header.render ? header.render(value, row) : value;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header.key}>{header.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {visibleRows.length ? (
          visibleRows.map((row, index) => (
            <TableRow
              onClick={() => onRowClick?.(row)}
              key={startIndex + index}
            >
              {headers.map((header) => (
                <TableCell key={header.key}>
                  {renderCell<H>(header, row)}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={headers.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={headers.length}>
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <span className="text-xs text-faded">
                Showing {rowList.length === 0 ? 0 : startIndex + 1}–
                {Math.min(startIndex + visibleRows.length, rowList.length)} of{" "}
                {rowList.length}
              </span>

              <Pagination>
                <PaginationContent className="ml-auto">
                  <PaginationItem>
                    <PaginationPrevious
                      aria-disabled={previousDisabled}
                      className={
                        previousDisabled
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      onClick={() => {
                        if (!previousDisabled) {
                          onDecrease?.();
                          setPage(safePage - 1);
                        }
                      }}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((number, index) => (
                    <PaginationItem key={`${number}-${index}`}>
                      {number === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          isActive={number === safePage}
                          aria-current={
                            number === safePage ? "page" : undefined
                          }
                          onClick={(event) => {
                            event.preventDefault();
                            if (number !== safePage) {
                              setPage(number);
                            }
                          }}
                          className=" size-8 !h-8 text-xs rounded-[10px]"
                        >
                          {number}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      aria-disabled={nextDisabled}
                      className={
                        nextDisabled
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      onClick={() => {
                        if (!nextDisabled) {
                          onIncrease?.();
                          setPage(safePage + 1);
                        }
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
