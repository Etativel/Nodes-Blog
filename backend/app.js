const express = require("express");
const app = express();
const passport = require("passport");
// require("./services/passportAdmin");
// require("./services/passport");
require("./services/passportConfig");

const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "https://nodes-blog.up.railway.app",
      "https://nodes-admin.up.railway.app",
    ],
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
    methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  })
);
app.use(passport.initialize());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
// app.use(passport.initialize());
// app.use(passport.session());

const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");
const userRouter = require("./routes/userRouter");
const adminAuthRouter = require("./routes/adminAuth");
const authRouter = require("./routes/auth");
const adminPanelDashboardRouter = require("./routes/AdminPanel/DashboardPageRouter");
const adminPostsPanelRouter = require("./routes/AdminPanel/PostsPageRouter");
const adminUsersPanelRouter = require("./routes/AdminPanel/UsersPageRouter");
const adminCommentsPanelRouter = require("./routes/AdminPanel/CommentsPageRouter");

const imageUploadRouter = require("./routes/imageUploadRoutes");

app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter.router);
app.use("/adminauth", adminAuthRouter.router);
app.use("/img", imageUploadRouter);
app.use("/admin-dashboard-api", adminPanelDashboardRouter);
app.use("/admin-posts-api", adminPostsPanelRouter);
app.use("/admin-users-api", adminUsersPanelRouter);
app.use("/admin-comments-api", adminCommentsPanelRouter);

app.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});

const PORT = 3000;

app.listen(PORT, () => console.log("app running on port ", PORT));
