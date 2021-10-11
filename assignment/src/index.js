const express = require('express');
const app = express();
app.use(express.json());

const authController = require("./controllers/auth.controller");
const postController = require("./controllers/post.controller");

app.use("/user", authController);
app.use("/post", postController);


module.exports = app;