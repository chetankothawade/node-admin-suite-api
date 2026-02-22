export const getPaginationParams = (query, defaults = {}) => {
  const defaultPage = defaults.page || 1;
  const defaultLimit = defaults.limit || 10;
  const defaultSortField = defaults.sortedField || "createdAt";
  const defaultSortOrder = defaults.sortedBy || "DESC";

  const page = parseInt(query.page, 10) || defaultPage;
  const limit = parseInt(query.limit, 10) || defaultLimit;
  const offset = (page - 1) * limit;
  const sortedField = query.sortedField || defaultSortField;
  const sortedBy = query.sortedBy?.toUpperCase() === "ASC" ? "ASC" : defaultSortOrder;

  return { page, limit, offset, sortedField, sortedBy };
};

export const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    perPage: limit,
    currentPage: page,
    totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
};
