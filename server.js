const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");
const app = express();
const port = process.env.PORT || 3001;
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret", // Clave secreta para firmar la sesión (puede ser cualquier cadena aleatoria).
    resave: false, // No volver a guardar la sesión si no ha habido cambios.
    saveUninitialized: true, // Guarda una sesión aún si no está modificada.
  })
);
app.use(passport.initialize()); // Inicializa el passport para la autenticacion
app.use(passport.session()); // Mantiene la sesion del usuario

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Z-Key"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});
app.use(cors(["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"])); // Cconfigura cors para permitir ciertas soliitudes HTTP
app.use(cors({ origin: "*" })); // Permite que se acepten solicitudes desde cualquier origen
app.use("/", require("./routes/index")); // Asegúrate de que './routes/index' exporte una función o router

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID, // Campo que se usará como nombre de usuario
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // Campo que se usará como contraseña
      callbackURL: process.env.CALLBACK_URL, // Deshabilitar sesiones ya que utilizaremos JWT
    },
    function (accesstoken, refreshtoken, profile, done) {
      return done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
app.get("/", (req, res) => {
  res.send(
    req.session.user != undefined
      ? `Logged in as ${req.session.user.displayName}`
      : "Logged out"
  );
});
app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
    session: false,
  }),
  (req, res) => {
    req.session.user = req.user;
    res.send("Logged in as a Gerard Vigo");
  }
);

app.use("/", require("./routes"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Z-Key"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening an node Running on port ${port}`);
    });
  }
});
