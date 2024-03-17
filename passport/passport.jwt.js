import passport from "passport";
import { Strategy } from "passport-jwt";
import UsersDAO from "../dao/users/users.dao.js";

passport.use(
  "jwt",
  new Strategy(
    {
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.signedCookies) {
          token = req.signedCookies["jwt"];
        }
        return token;
      },

      secretOrKey: "ShhhhhEsSecreto",
    },
    async function (jwt_payload, done) {
      let userId = jwt_payload.id;
      let user = await UsersDAO.getUserByID(userId);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }
  )
);

export default passport;
