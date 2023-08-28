const express = require('express');

const blogController = require('../controllers/blogController');

const router = express.Router();

router.route('/')
    .get(blogController.getAllBlog)
    .post(blogController.createBlog)
;

router.route('/:id')
    .get(blogController.getBlog)
    .patch(blogController.updateBlog)
    .delete(blogController.deleteBlog)
;

router.get('/myBlogs', blogController.getUserBlogs);
router.get('/:userId', blogController.getBlogsByUserId);
// router.get('/:userId/:id', blogController.getOneBlogByUserId);

module.exports = router;