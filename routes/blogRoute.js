const express = require('express');

const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');


const router = express.Router();

router.route('/')
    .get(blogController.getAllBlog)
    .post(authController.protect, blogController.createBlog)
;

router.route('/:id')
    .get(blogController.getBlog)
    .patch(blogController.updateBlog)
    .delete(blogController.deleteBlog)
;

router.get('/myBlogs', blogController.getMyBlogs);
router.get('/:Creatorslug', blogController.getBlogsbyCreatorSlug);
router.get('/:Creatorslug/:blogId', blogController.getOneBlogbyCreatorSlug);

router.get('/:tags', blogController.getBlogsByTags);
router.get('/:category', blogController.getBlogsByCategory);
router.get('/most-liked', blogController.getBlogsByMostLiked);
router.get('/most-viewed', blogController.getBlogsByMostViewed);
router.get('/most-shared', blogController.getBlogsByMostShared);

router.get('/most-engaging', blogController.getBlogsByMostEngaging);
router.get('/trending', blogController.getTrendingPosts);




module.exports = router;