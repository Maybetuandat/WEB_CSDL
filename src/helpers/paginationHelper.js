module.exports = (objectPagination, query, countProducts) => {
  if (countProducts == null) countProducts = 0;
  // page for step
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitedItem;

  // calculate total pages
  const totalPage = Math.ceil(countProducts / objectPagination.limitedItem);

  objectPagination.totalPages = totalPage;

  return objectPagination;
};
