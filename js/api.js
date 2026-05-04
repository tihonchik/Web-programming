const baseUrl = "http://localhost:3000/";

async function GetGoods(
  type,
  searchText,
  searchKey,
  sortField,
  sortType,
  categories,
  perPage,
  page,
) {
  const url = new URL(baseUrl + type);

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
  } catch {
    return [];
  }
}

async function AddGood(type, good) {
  const url = new URL(baseUrl + type);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(good),
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function DeleteGood(type, id) {
  const url = new URL(baseUrl + type + "/" + id);
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function UpdateGood(type, good) {
  const url = new URL(baseUrl + type + "/" + good.id);
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(good),
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function Register(user) {
  try {
    const response = await fetch(baseUrl + "users", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function GetUsers() {
  try {
    const response = await fetch(baseUrl + "users", {
      method: "GET",
    });
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch {
    return [];
  }
}

async function Login(email, password) {
  try {
    const url = new URL(baseUrl + "users");
    url.searchParams.append("email", email);
    url.searchParams.append("password", password);

    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const users = await response.json();
    return users.length > 0 ? users[0] : null;
  } catch {
    return null;
  }
}

async function AddToUserBasket(userId, goodId) {
  try {
    const response = await fetch(baseUrl + "userBasket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, goodId }),
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function AddToUserFavorites(userId, favId) {
  try {
    const response = await fetch(baseUrl + "userFavorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, favId }),
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function GetUserBasket(userId) {
  try {
    const basketResponse = await fetch(baseUrl + `userBasket?userId=${userId}`);
    if (!basketResponse.ok) {
      return [];
    }
    const basketItems = await basketResponse.json();

    const goodsPromises = basketItems.map(async (item) => {
      const goodResponse = await fetch(baseUrl + `goods/${item.goodId}`);
      if (!goodResponse.ok) {
        return null;
      }
      const good = await goodResponse.json();
      return { ...good, count: item.count || 1, basketItemId: item.id };
    });

    const goods = await Promise.all(goodsPromises);
    return goods.filter((good) => good !== null);
  } catch {
    return [];
  }
}

async function GetUserBasketFiltered(
  userId,
  searchText,
  searchKey,
  sortField,
  sortType,
  categories,
  perPage,
  page,
) {
  try {
    const basketResponse = await fetch(baseUrl + `userBasket?userId=${userId}`);
    if (!basketResponse.ok) {
      return [];
    }
    const basketItems = await basketResponse.json();

    if (basketItems.length === 0) {
      return [];
    }

    const goodsPromises = basketItems.map(async (item) => {
      const goodResponse = await fetch(baseUrl + `goods/${item.goodId}`);
      if (!goodResponse.ok) {
        return null;
      }
      const good = await goodResponse.json();
      return {
        ...good,
        count: item.count || 1,
        basketItemId: item.id,
      };
    });

    let goods = await Promise.all(goodsPromises);
    goods = goods.filter((good) => good !== null);

    if (searchText) {
      goods = goods.filter((good) => {
        const value = String(good[searchKey]).toLowerCase();
        if (searchKey === "coast") {
          return parseFloat(good[searchKey]) > parseFloat(searchText);
        }
        return value.includes(searchText);
      });
    }

    if (categories && categories.length > 0) {
      goods = goods.filter((good) => categories.includes(good.category));
    }

    if (sortField) {
      goods.sort((a, b) => {
        if (sortType === "desc") {
          return a[sortField] < b[sortField] ? 1 : -1;
        } else {
          return a[sortField] > b[sortField] ? 1 : -1;
        }
      });
    }

    if (perPage && page) {
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedGoods = goods.slice(start, end);
      const totalPages = Math.ceil(goods.length / perPage);
      return { data: paginatedGoods, pages: totalPages };
    }

    return goods;
  } catch (error) {
    console.error("GetUserBasketFiltered error:", error);
    return [];
  }
}

async function Buy(userId) {
  try {
    const basketResponse = await fetch(baseUrl + `userBasket?userId=${userId}`);
    if (!basketResponse.ok) {
      return false;
    }
    const basketItems = await basketResponse.json();

    const deletePromises = basketItems.map((item) =>
      fetch(baseUrl + `userBasket/${item.id}`, { method: "DELETE" }),
    );

    await Promise.all(deletePromises);
    return true;
  } catch {
    return false;
  }
}

async function GetUserFavorites(userId) {
  try {
    const favoritesResponse = await fetch(
      baseUrl + `userFavorites?userId=${userId}`,
    );
    if (!favoritesResponse.ok) {
      return [];
    }
    const favoritesItems = await favoritesResponse.json();

    const goodsPromises = favoritesItems.map(async (item) => {
      const goodResponse = await fetch(baseUrl + `goods/${item.favId}`);
      if (!goodResponse.ok) {
        return null;
      }
      const good = await goodResponse.json();
      return { ...good, favoriteItemId: item.id };
    });

    const goods = await Promise.all(goodsPromises);
    return goods.filter((good) => good !== null);
  } catch {
    return [];
  }
}

async function GetUserFavoritesFiltered(
  userId,
  searchText,
  searchKey,
  sortField,
  sortType,
  categories,
  perPage,
  page,
) {
  try {
    const favoritesResponse = await fetch(
      baseUrl + `userFavorites?userId=${userId}`,
    );
    if (!favoritesResponse.ok) {
      return [];
    }
    const favoritesItems = await favoritesResponse.json();

    if (favoritesItems.length === 0) {
      return [];
    }

    const goodsPromises = favoritesItems.map(async (item) => {
      const goodResponse = await fetch(baseUrl + `goods/${item.favId}`);
      if (!goodResponse.ok) {
        return null;
      }
      const good = await goodResponse.json();
      return {
        ...good,
        favoriteItemId: item.id,
      };
    });

    let goods = await Promise.all(goodsPromises);
    goods = goods.filter((good) => good !== null);

    if (searchText) {
      goods = goods.filter((good) => {
        const value = String(good[searchKey]).toLowerCase();
        if (searchKey === "coast") {
          return parseFloat(good[searchKey]) > parseFloat(searchText);
        }
        return value.includes(searchText);
      });
    }

    if (categories && categories.length > 0) {
      goods = goods.filter((good) => categories.includes(good.category));
    }

    if (sortField) {
      goods.sort((a, b) => {
        if (sortType === "desc") {
          return a[sortField] < b[sortField] ? 1 : -1;
        } else {
          return a[sortField] > b[sortField] ? 1 : -1;
        }
      });
    }

    if (perPage && page) {
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedGoods = goods.slice(start, end);
      const totalPages = Math.ceil(goods.length / perPage);
      return { data: paginatedGoods, pages: totalPages };
    }

    return goods;
  } catch (error) {
    console.error("GetUserFavoritesFiltered error:", error);
    return [];
  }
}

async function UpdateUserBasketItem(basketItemId, basket) {
  try {
    const response = await fetch(baseUrl + `userBasket/${basketItemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(basket),
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function DeleteUserBasketItem(basketItemId) {
  try {
    const response = await fetch(baseUrl + `userBasket/${basketItemId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function DeleteUserFavoriteItem(favoriteItemId) {
  try {
    const response = await fetch(baseUrl + `userFavorites/${favoriteItemId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export {
  DeleteGood,
  GetGoods,
  AddGood,
  UpdateGood,
  Register,
  GetUsers,
  Login,
  AddToUserBasket,
  AddToUserFavorites,
  GetUserBasket,
  GetUserBasketFiltered,
  Buy,
  GetUserFavorites,
  GetUserFavoritesFiltered,
  UpdateUserBasketItem,
  DeleteUserBasketItem,
  DeleteUserFavoriteItem,
};
