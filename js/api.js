const baseUrl = "http://localhost:3000/";

async function GetGoods(searchText, searchKey, sortField, sortType) {
  let goods = [];

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

  try {
    const response = await fetch(url);
    const result = await response.json();
    goods = result;
  } catch {}
  return goods;
}

export default GetGoods;
