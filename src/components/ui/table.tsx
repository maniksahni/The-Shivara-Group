/**
 * Table Component
 *
 * A generic, fully typed dark-mode data table.
 *
 * Features:
 *  - Column config array: { key, header, render?, width? }
 *  - Dark styled rows (bg-slate-800) with hover:bg-slate-700
 *  - Built-in skeleton loading state
 *  - Empty state with custom icon and message
 *  - Integrated Pagination component
 */

import React from "react";

// ---------------------------------------------------------------------------
// Column definition
// ---------------------------------------------------------------------------

export interface TableColumn<T> {
  /**
   * Unique identifier. Also used as the default accessor key on the data row.
   * If `render` is provided, `key` only needs to be unique — it does not need
   * to be a key of T.
   */
  key: string;
  /** Column header label */
  header: string;
  /** Optional fixed/max width, e.g. "120px" or "10%" */
  width?: string;
  /**
   * Custom render function.
   * When omitted, the cell displays `String(row[key as keyof T] ?? "—")`.
   */
  render?: (row: T, index: number) => React.ReactNode;
  /** Text alignment in both header and cell */
  align?: "left" | "center" | "right";
}

// ---------------------------------------------------------------------------
// Table props
// ---------------------------------------------------------------------------

export interface TableProps<T> {
  /** Column configuration array */
  columns: TableColumn<T>[];
  /** Array of row data objects */
  data: T[];
  /** Unique key extractor for each row (defaults to row index) */
  rowKey?: (row: T, index: number) => string | number;
  /** When true, renders skeleton loading rows */
  loading?: boolean;
  /** Number of skeleton rows to show while loading */
  skeletonRows?: number;
  /** Message shown when data is empty */
  emptyMessage?: string;
  /** Icon shown above the empty message */
  emptyIcon?: React.ReactNode;
  /** Called when a row is clicked */
  onRowClick?: (row: T) => void;
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Show a horizontal divider between rows */
  showDividers?: boolean;
}

// ---------------------------------------------------------------------------
// Alignment map
// ---------------------------------------------------------------------------

const alignClass: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// ---------------------------------------------------------------------------
// Default empty icon
// ---------------------------------------------------------------------------

const DefaultEmptyIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="h-10 w-10 text-slate-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c0 .621-.504 1.125-1.125 1.125m2.25-2.625c0-.621.504-1.125 1.125-1.125M12 10.875V9.75M12 9.75c0-.621.504-1.125 1.125-1.125m-1.125 0V7.5M12 7.5h.008"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Skeleton cell
// ---------------------------------------------------------------------------

const SkeletonCell: React.FC<{ wide?: boolean }> = ({ wide = false }) => (
  <td className="px-4 py-3">
    <div
      className={[
        "h-3 rounded-full bg-slate-700 animate-pulse",
        wide ? "w-3/4" : "w-1/2",
      ].join(" ")}
    />
  </td>
);

// ---------------------------------------------------------------------------
// Table component
// ---------------------------------------------------------------------------

function Table<T>({
  columns,
  data,
  rowKey,
  loading = false,
  skeletonRows = 5,
  emptyMessage = "No records found",
  emptyIcon,
  onRowClick,
  className = "",
  showDividers = true,
}: TableProps<T>): React.ReactElement {
  const isEmpty = !loading && data.length === 0;
  const isClickable = Boolean(onRowClick);

  return (
    <div
      className={[
        "w-full overflow-hidden rounded-xl",
        "border border-slate-700 bg-slate-800",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          {/* Head */}
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={[
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wider",
                    "text-slate-400 select-none whitespace-nowrap",
                    alignClass[col.align ?? "left"],
                  ].join(" ")}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody
            className={[
              showDividers ? "divide-y divide-slate-700/60" : "",
            ].join(" ")}
          >
            {/* Loading skeleton */}
            {loading &&
              Array.from({ length: skeletonRows }).map((_, ri) => (
                <tr key={`skeleton-${ri}`} className="bg-slate-800">
                  {columns.map((col, ci) => (
                    <SkeletonCell key={col.key} wide={ci === 0} />
                  ))}
                </tr>
              ))}

            {/* Empty state */}
            {isEmpty && (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
                    {emptyIcon ?? <DefaultEmptyIcon />}
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading &&
              data.map((row, ri) => {
                const key = rowKey ? rowKey(row, ri) : ri;
                return (
                  <tr
                    key={key}
                    onClick={isClickable ? () => onRowClick!(row) : undefined}
                    className={[
                      "bg-slate-800 transition-colors duration-100",
                      isClickable
                        ? "cursor-pointer hover:bg-slate-700"
                        : "hover:bg-slate-750",
                    ].join(" ")}
                  >
                    {columns.map((col) => {
                      const cellContent = col.render
                        ? col.render(row, ri)
                        : String(
                            (row as Record<string, unknown>)[col.key] ?? "—"
                          );

                      return (
                        <td
                          key={col.key}
                          className={[
                            "px-4 py-3 text-slate-200 whitespace-nowrap",
                            alignClass[col.align ?? "left"],
                          ].join(" ")}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagination component
// ---------------------------------------------------------------------------

export interface PaginationProps {
  /** The current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Called when the user navigates to a new page */
  onPageChange: (page: number) => void;
  /** Items per page label, e.g. "25 per page" */
  perPageLabel?: string;
  /** Total items count label, e.g. "250 results" */
  totalLabel?: string;
  /** Extra classes */
  className?: string;
}

const ChevronLeft: React.FC = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-4 w-4"
  >
    <path
      fillRule="evenodd"
      d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronRight: React.FC = () => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-4 w-4"
  >
    <path
      fillRule="evenodd"
      d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Computes the page numbers to display, with ellipses where appropriate.
 * Always shows first, last, current, and up to 1 neighbour on each side.
 */
function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];
  const add = (n: number | "...") => pages.push(n);

  add(1);

  if (current > 3) add("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) add(i);

  if (current < total - 2) add("...");

  add(total);

  return pages;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  perPageLabel,
  totalLabel,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const pages = buildPageRange(currentPage, totalPages);

  const btnBase = [
    "inline-flex items-center justify-center rounded-md",
    "h-8 min-w-[2rem] px-2",
    "text-xs font-medium transition-colors duration-100",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/50",
  ].join(" ");

  const activePage = [btnBase, "bg-[#C9A84C] text-slate-900"].join(" ");
  const inactivePage = [
    btnBase,
    "text-slate-300 hover:bg-slate-700 hover:text-white",
    "disabled:opacity-40 disabled:pointer-events-none",
  ].join(" ");

  return (
    <div
      className={[
        "flex flex-wrap items-center justify-between gap-4",
        "border-t border-slate-700 bg-slate-800 px-4 py-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Labels */}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        {totalLabel && <span>{totalLabel}</span>}
        {perPageLabel && <span>{perPageLabel}</span>}
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={inactivePage}
        >
          <ChevronLeft />
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-8 min-w-[2rem] items-center justify-center text-xs text-slate-500"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-label={`Go to page ${p}`}
              aria-current={p === currentPage ? "page" : undefined}
              onClick={() => onPageChange(p as number)}
              className={p === currentPage ? activePage : inactivePage}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={inactivePage}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

Pagination.displayName = "Pagination";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Table, Pagination };
export default Table;
