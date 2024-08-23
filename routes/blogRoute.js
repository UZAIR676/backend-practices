const express = require('express');

const router = express.Router();

const { getAllblogsController, createBlogController, deleteBlogController, updateBlogController,userBlogController } = require('../controllers/blogContoller.js');

router.get('/all-blogs', getAllblogsController);


router.post('/create-blog', createBlogController);

router.delete('/delete-blog/:id', deleteBlogController);

router.put('/update-blog/:id', updateBlogController);

router.get('/user-blog/:Id', userBlogController);

module.exports = router;
