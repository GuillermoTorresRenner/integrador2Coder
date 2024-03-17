import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import passport from "./passport/passport.jwt.js";
import morgan from "morgan";

import router_session from "./routes/sessions.js";

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(passport.initialize());

app.use(cookieParser("secret_cookie"));

app.use("/api/session/", router_session);

mongoose
  .connect("mongodb://localhost:27017/integrador2", {
    authSource: "admin",
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log("Aplicación funcionando en el puerto 3000");
});
