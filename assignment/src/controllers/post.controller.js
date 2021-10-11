const express = require('express');
const router = express.Router();

const Post = require("../models/post.model");
const authenticate = require("../middlewares/authenticate");

router.get("/", authenticate, async(req, res) => {
    const post = await Post.find().lean().exec();
    const user = req.user;
    return res.status(200).send({post, user})
})

module.exports = router;