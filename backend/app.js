const express = require("express");
const app = express();
const passport = require("passport");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(passport.initialize());
// app.use(passport.session());

const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");

app.use("/post", postRouter);
app.use("/comment", commentRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});

const PORT = 3000;

app.listen(PORT, () => console.log("app running on port ", PORT));
