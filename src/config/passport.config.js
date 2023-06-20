import passport from "passport";
import local from "passport-local";
import { createHash, validatePassword } from "../utils.js";
import UserManager from "../dao/mongo/managers/users.js";
import GithubStrategy from "passport-github2";
import dotenv from 'dotenv'
dotenv.config()

const userManager = new UserManager();

const LocalStrategy = local.Strategy;

const initializePassportStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name } = req.body;
          //Corroboro si el usuario ya existe.
          const exists = await userManager.getUsersBy({ email });
          //Done devuelve un usuario en req.user;
          if (exists)
            return done(null, false, { message: "El usuario ya existe" });
          //Si el usuario no existe, encripto su contraseña
          const hashedPassword = await createHash(password);
          //Construyo el usuario que voy a registrar
          const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword,
          };
          const result = await userManager.createUsers(user);
          // Si todo salió bien, Ahí es cuando done debe finalizar bien.
          done(null, result);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        // PASSPORT SÓLO DEBE DEVOLVER AL USUARIO FINAL, ÉL NO ES RESPONSABLE DE LA SESIÓN
        if (email === "adminCoder@coder.com" && password === "admin123") {
          //Desde aquí ya puedo inicializar al admin.
          const user = {
            id: 0,
            name: `Admin`,
            role: "admin",
            email: "...",
          };
          return done(null, user);
        }
        let user;
        //  Buscar si el usuario existe
        user = await userManager.getUsersBy({ email }); //Sólo busco por mail
        if (!user)
          return done(null, false, { message: "Credenciales incorrectas" });

        // Si existe el usuario, VERIFICO SU PASSWORD ENCRIPTADO
        const isValidPassword = await validatePassword(password, user.password);
        if (!isValidPassword)
          return done(null, false, { message: "Contraseña inválida" });

        // Si existe y puso su contraseña correcta, como estoy en passport, sólo devuelvo al usuario
        user = {
          id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role,
        };
        
        return done(null, user);
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accesToken, refreshToken, profile, done) => {
        try {
          const { name } = profile._json;

          let emailGitHub = `${profile._json.login}@github.com`;

          const user = await userManager.getUsersBy({ email: emailGitHub });
          console.log(user);
          if (!user) {
            const newUser = {
              first_name: name,
              email: emailGitHub,
              password: "",
            };
            const result = await userManager.createUsers(newUser);
            return done(null, result);
          }
          // si ya existe

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    return done(null, user.email);
  });
  passport.deserializeUser(async function (id, done) {
    if (id === 0) {
      return done(null, {
        role: "admin",
        name: "ADMIN",
      });
    }
    const user = await userManager.getUsersBy({ _id: id });
    return done(null, user);
  });
};
export default initializePassportStrategies;