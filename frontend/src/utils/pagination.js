export const paginate = (items, currentPage, pageSize) => {
  const startIndex = (currentPage - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
};

export const getTotalPages = (items, pageSize) => {
  return Math.ceil(items.length / pageSize);
};
