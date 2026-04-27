const storage = {
  get(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  },

  add(key, item) {
    const items = this.get(key);
    if (!items.find((i) => i.title === item.title)) {
      items.push(item);
      localStorage.setItem(key, JSON.stringify(items));
      return true;
    }
    return false;
  },
  remove(key, item) {
    const items = this.get(key);
    const newItems = items.filter((i) => i.title !== item.title);
    if (newItems.length < items.length) {
      localStorage.setItem(key, JSON.stringify(newItems));
      return true;
    }

    return false;
  },
};

export default storage;
