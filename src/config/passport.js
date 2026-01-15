import passport from "passport";
import LocalStrategy from "passport-local";
import JWTStrategy from "passport-jwt";
import User from "../models/user.model.js";
import { verifyToken, extractToken } from "../utils/jwt.js";

const JWTExtract = JWTStrategy.ExtractJwt;


passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }

        if (!user.comparePassword(password)) {
          return done(null, false, { message: "Contraseña incorrecta" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);


passport.use(
  "jwt",
  new JWTStrategy.Strategy(
    {
      jwtFromRequest: JWTExtract.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "tu_secret_key_segura_aqui"
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);


passport.use(
  "current",
  new JWTStrategy.Strategy(
    {
      jwtFromRequest: (req) => {
        if (req && req.headers.authorization) {
          return extractToken(req.headers.authorization);
        }
        return null;
      },
      secretOrKey: process.env.JWT_SECRET || "tu_secret_key_segura_aqui"
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);

        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
