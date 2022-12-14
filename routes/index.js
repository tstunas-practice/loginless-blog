const express = require('express');
const router = express.Router();
const postRoutes = require('./posts');
const commentRoutes = require('./comments');

router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
