import bcrypt from "bcrypt";

import Users from "./UsersModel.js";

class UsersDAO {
  static async getUserByEmail(email) {
    return await Users.findOne({ email });
  }

  static async getUserByLogin(email, password) {
    let user = await Users.findOne(
      { email },
      { _id: 1, first_name: 1, last_name: 1, age: 1, email: 1, password: 1 }
    ).lean();

    if (user) {
      let validatePassword = await bcrypt.compare(password, user.password);

      if (validatePassword) {
        delete user.password;
        return user;
      }
    }

    return null;
  }

  static async register(first_name, last_name, age, email, password) {
    password = await bcrypt.hash(password, 10);
    return await new Users({
      first_name,
      last_name,
      age,
      email,
      password,
    }).save();
  }

  static async getUserByID(id) {
    return await Users.findOne(
      { _id: id },
      { first_name: 1, last_name: 1, age: 1, email: 1 }
    ).lean();
  }
}

export default UsersDAO;
