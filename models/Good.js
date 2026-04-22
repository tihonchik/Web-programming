class Good {
  constructor(title, description, coast, photoURL, company, volume, category) {
    this.title = title;
    this.description = description;
    this.coast = coast;
    this.photoURL = photoURL;
    this.company = company;
    this.volume = volume;
    this.category = category;
  }

  addToCoast(number) {
    return new Good(
      this.title,
      this.description,
      this.coast + number,
      this.photoURL,
      this.company,
      this.volume,
      this.category,
    );
  }
}
export default Good;
