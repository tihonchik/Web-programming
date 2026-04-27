const baseUrl = "http://localhost:3000/";

async function GetGoods(
  searchText,
  searchKey,
  sortField,
  sortType,
  categories,
  perPage,
  page,
) {
  const url = new URL(baseUrl + "goods");

  if (searchText) {
    let typeSearch;
    if (
      searchKey == "title" ||
      searchKey == "description" ||
      searchKey == "volume"
    ) {
      typeSearch = "contains";
    }
    if (searchKey == "coast") {
      typeSearch = "gt";
    }
    url.searchParams.append(`${searchKey}:${typeSearch}`, searchText);
  }
  if (sortField && sortType) {
    url.searchParams.append(
      `_sort`,
      sortType != "desc" ? sortField : "-" + sortField,
    );
  }

  if (categories && categories.length != 0) {
    url.searchParams.append("category:in", categories);
  }

  if (perPage && page) {
    url.searchParams.append("_page", page);
    url.searchParams.append("_per_page", perPage);
  }

  try {
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch {}
  return [];
}

export default GetGoods;
