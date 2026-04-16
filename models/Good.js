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
    this.coast = this.coast + number;
    return this;
  }
}

export default Good;
