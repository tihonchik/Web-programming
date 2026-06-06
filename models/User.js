class User {
  constructor(
    id,
    firstName,
    secondName,
    surname,
    role,
    email,
    number,
    birthday,
    password,
    nickname,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.secondName = secondName;
    this.surname = surname;
    this.role = role;
    this.email = email;
    this.number = number;
    this.birthday = birthday;
    this.password = password;
    this.nickname = nickname;
  }
}

export default User;
