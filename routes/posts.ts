import express from 'express';
const router = express.Router();
import { auth } from '../middlewares/auth';
import { createPost, deletePost, getAllPosts, getPostByID, updatePost } from '../controllers/posts.controller';


router.get('/', getAllPosts)
router.get('/:id', getPostByID)
router.post('/', auth, createPost );
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router