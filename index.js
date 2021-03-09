const express = require("express");
const path = require("path");

const session = require("express-session");
const handlebars = require("express-handlebars");
const morgan = require("morgan");

const { port } = require("./config");

const loginRouter = require("./routes/login.js");
const logoutRouter = require("./routes/logout.js");
const signupRouter = require("./routes/signup.js");
const movieRouter = require("./routes/movie.js");
const homeRouter = require("./routes/home.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

// app.set('views', path.join(__dirname, 'views'));

app.set("view engine", "handlebars");

// TODO: Not sure if this is correct, need to check later
app.engine(
  "handlebars",
  handlebars({
    layoutsDir: __dirname + "/views/layouts",
  })
);

// Configure session middleware
app.use(
  session({
    // name: how do we name it?, connect.sid by default
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour
    },
    secret: "I like to sing, sing in the shower. Ah-ha!",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/users", movieRouter);
app.use("/", homeRouter);

// Add route for handling 404 requests - unavailable routes (should be in the end)
app.use((req, res) => {
  res.status(404).render("pages/error", {
    err: { message: "HTTP ERROR 404. This page does not exist" },
    title: "Error | Pathe Gaumont Movie Platform",
  });
});

app.listen(port, () =>
  console.log(`Server is listening on localhost:${port}\n`)
);
