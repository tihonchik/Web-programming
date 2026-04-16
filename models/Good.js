class Good {
  constructor(title, description, coast, photoURL, company, volume) {
    this.title = title;
    this.description = description;
    this.coast = coast;
    this.photoURL = photoURL;
    this.company = company;
    this.volume = volume;
  }

  addToCoast(number) {
    return new Good(
      this.title,
      this.description,
      this.coast + number,
      this.photoURL,
      this.company,
      this.volume,
    );
  }
}

export default Good;
