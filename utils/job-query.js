const ALLOWED_STATUSES = new Set(["interview", "declined", "pending"]);
const SORT_FIELDS = new Set(["company", "position", "status", "createdAt"]);
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const parsePositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseSort = (value) => {
  const requestedSort = typeof value === "string" ? value : "-createdAt";
  const descending = requestedSort.startsWith("-");
  const field = descending ? requestedSort.slice(1) : requestedSort;

  return SORT_FIELDS.has(field)
    ? `${descending ? "-" : ""}${field}`
    : "-createdAt";
};

const buildJobQuery = (query = {}) => {
  const filter = {};
  const search = typeof query.search === "string" ? query.search.trim() : "";
  const status = typeof query.status === "string" ? query.status.toLowerCase() : "";

  if (search) {
    const safeSearch = escapeRegex(search);
    filter.$or = [
      { company: { $regex: safeSearch, $options: "i" } },
      { position: { $regex: safeSearch, $options: "i" } },
    ];
  }

  if (ALLOWED_STATUSES.has(status)) {
    filter.status = status;
  }

  const page = parsePositiveInteger(query.page, 1);
  const requestedLimit = parsePositiveInteger(query.limit, DEFAULT_PAGE_SIZE);
  const limit = Math.min(requestedLimit, MAX_PAGE_SIZE);

  return {
    filter,
    options: {
      sort: parseSort(query.sort),
      skip: (page - 1) * limit,
      limit,
    },
    pagination: {
      page,
      limit,
    },
  };
};

const buildPaginationMeta = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  pages: total === 0 ? 0 : Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPreviousPage: page > 1,
});

module.exports = {
  buildJobQuery,
  buildPaginationMeta,
};
