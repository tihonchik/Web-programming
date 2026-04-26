const baseUrl = "http://localhost:3000/";

async function GetGoods(searchText, searchKey) {
  console.log("Событие сработало! Значение:"); // ПРОВЕРКА
  let goods = [];

  let url = baseUrl + "goods?";

  const params = new URLSearchParams();
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
      typeSearch = "eq";
    }
    params.append(`${searchKey}:${typeSearch}`, searchText);
  }

  const finalUrl = params.toString() ? `${url}${params.toString()}` : url;
  try {
    const response = await fetch(finalUrl);
    const result = await response.json();
    goods = result;
  } catch {}
  return goods;
}

export default GetGoods;
