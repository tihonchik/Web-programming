class Good {
  constructor(
    id,
    title,
    description,
    coast,
    photoURL,
    company,
    volume,
    category,
    count,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.coast = coast;
    this.photoURL = photoURL;
    this.company = company;
    this.volume = volume;
    this.category = category;
    this.count = count;
  }

  addToCoast(number) {
    return new Good(
      this.id,
      this.title,
      this.description,
      this.coast + number,
      this.photoURL,
      this.company,
      this.volume,
      this.category,
      this.count,
    );
  }
}
export default Good;
