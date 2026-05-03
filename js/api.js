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

export { DeleteGood, GetGoods, AddGood, UpdateGood, Register, GetUsers, Login };
