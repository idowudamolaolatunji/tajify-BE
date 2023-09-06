const express = require('express');

const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');
const commentController = require('../controllers/blogMetricsControllers/commentController');
const likeController = require('../controllers/blogMetricsControllers/likesControllers');
const shareController = require('../controllers/blogMetricsControllers/shareController');
const savedController = require('../controllers/blogMetricsControllers/savedController');
const viewController = require('../controllers/blogMetricsControllers/viewsController')


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

router.get('/category/:category', blogController.getBlogsByCategory);

router.get('/myBlogs', authController.protect, blogController.getMyBlogs);
router.get('/:Creatorslug', blogController.getBlogsbyCreatorSlug);
router.get('/:Creatorslug/:blogId', blogController.getOneBlogbyCreatorSlug);

router.get('tags/:tags', blogController.getBlogsByTags);
router.get('/most-liked', blogController.getBlogsByMostLiked);
router.get('/most-viewed', blogController.getBlogsByMostViewed);
router.get('/most-shared', blogController.getBlogsByMostShared);

router.get('/most-engaging', blogController.getBlogsByMostEngaging);
router.get('/trending', blogController.getTrendingPosts);



// Blog metrics 
// (Comment)
router.post('/post-comment/:blogId', authController.protect, commentController.createComment);
router.get('/get-comments/:blogId', commentController.getAllBlogComments)
router.get('/edit-comments/:blogId/:commentId', commentController.updateBlogComment)
router.get('/get-comments/:blogId/:commentId', commentController.deleteBlogComment)

// (likes)
router.post('/like-post/:blogId', authController.protect, likeController.likePost)
router.post('/delet-post/:blogId', authController.protect, likeController.unlikePost)

// (share)
router.post('/share-post', shareController.sharePost);

// (saved)
router.post('/save-post', authController.protect, savedController.savePost);
router.post('/unsave-post', authController.protect, savedController.unsavePost);

// (view)
router.post('record-view', viewController.recordView);


module.exports = router;