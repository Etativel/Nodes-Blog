const express = require("express");
const app = express();
const passport = require("passport");
require("./services/passport");

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(passport.initialize());
// app.use(passport.session());

const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/auth");

app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/user", userRouter);
app.use("/login", authRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});

const PORT = 3000;

app.listen(PORT, () => console.log("app running on port ", PORT));
