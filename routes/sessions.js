import Router from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

import UsersDAO from "../dao/users/users.dao.js";

const router = Router();

router.post("/register", async (req, res) => {
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let email = req.body.email;
  let age = parseInt(req.body.age);
  let password = req.body.password;

  if (!first_name || !last_name || !email || !age || !password) {
    res.status(400).json({ status: 400, error: "Missing data" });
  }

  let validateUniqueEmail = await UsersDAO.getUserByEmail(email);

  if (validateUniqueEmail) {
    res.status(400).json({ status: 400, error: "Email already registered" });
  } else {
    await UsersDAO.register(first_name, last_name, age, email, password);
    res.status(200).json({ status: 200, error: "User created successfully" });
  }
});

router.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    res.status(400).json({ status: 400, error: "Missing credentials" });
  }

  let user = await UsersDAO.getUserByLogin(email, password);

  if (!user) {
    res.status(404).json({ status: 404, error: "User not found" });
  } else {
    let token = jwt.sign({ id: user._id }, "SiTeCuentoDebereMatarte", {
      expiresIn: "1h",
    });

    res
      .cookie("jwt", token, {
        signed: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      })
      .json({ status: 200, msg: "Login successfully" });
  }
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ status: 200, msg: "Logout successfully" });
});

export default router;
