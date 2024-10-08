import { Link, useSearchParams } from "@remix-run/react";

/**
 * @type {React.FC<{
 * totalPages: number|string
 * pageParam?: string
 * }>}
 */
const Pagination = ({
  totalPages = Number.MAX_SAFE_INTEGER,
  pageParam = "page",
  className = "",
  ...attrs
}) => {
  const [queryParams] = useSearchParams();
  const currentPage = Number(queryParams.get(pageParam) || 1);
  totalPages = Number(totalPages);

  const previousQuery = new URLSearchParams(queryParams);
  previousQuery.set(pageParam, currentPage - 1);
  const nextQuery = new URLSearchParams(queryParams);
  nextQuery.set(pageParam, currentPage + 1);

  return (
    <nav
      className={["flex flex-1 justify-between gap-4", className]
        .filter(Boolean)
        .join(" ")}
      {...attrs}
    >
      {currentPage <= 1 && <span></span>}
      {currentPage > 1 && (
        <Link to={`?${previousQuery.toString()}`}>Previous Page</Link>
      )}
      {currentPage >= totalPages && <span></span>}
      {currentPage < totalPages && (
        <Link to={`?${nextQuery.toString()}`}>Next Page</Link>
      )}
    </nav>
  );
};

export default Pagination;
