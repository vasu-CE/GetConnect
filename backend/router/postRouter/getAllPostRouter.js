const express = require('express');
const isAuthenticate = require('../../middleware/isAuthenticate');
const router = express.Router();

const Post = require('../../model/PostModel');

router.post('/', isAuthenticate, async (req, res) => {
    try {
      const userInterests = req.body.userInterest; 
      let { page = 1, limit = 5 } = req.query;
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
  
      let posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('author', 'userName profilePicture interests')
        .populate({
          path: 'comments.user',
          select: 'userName profilePicture'
        });
  
      if (userInterests.length > 0) {
        const normalizedUserInterests = userInterests.map((item) =>
          item.trim().replace(/\s/g, '').toLowerCase()
        );
  
        posts = posts.filter((post) => {
          if (!post.author.interests) return false;
          return post.author.interests.some((authorInterest) => {
            const normalizedAuthorInterest = authorInterest
              .trim()
              .replace(/\s/g, '')
              .toLowerCase();
            return normalizedUserInterests.includes(normalizedAuthorInterest);
          });
        });
      }
  
      // For pagination info, get the total count.
      // When filtering is applied in memory, this count does not reflect filtered count.
      // For a robust solution, perform a separate count query with matching criteria.
      const totalPosts = await Post.countDocuments();
  
      return res.status(200).json({
        success: true,
        posts,
        hasMore: page * limit < totalPosts
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  });

module.exports = router;
