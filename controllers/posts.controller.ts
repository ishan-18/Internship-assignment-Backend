import express,{ Request, Response } from "express";
import {connectionDB} from '../server';
import {PostInterface} from '../interfaces/post.interface';
import {UserInterface} from '../interfaces/user.interface'

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        connectionDB.query('SELECT * from posts', (err, results) => {
            if(err) throw err.message;
            res.status(200).json({results})
          })  
    } catch (err) {
        return res.status(500).json({err})
    }
}

export const getPostByID = async (req: Request,res: Response) =>{
    try {
        connectionDB.query('SELECT * from posts where _id=?', [req.params.id], (err, results) => {
            if(err) throw err.message;
            res.status(200).json({results})
          })  
    } catch (err) {
        return res.status(500).json({err})
    }
} 

export const createPost = async (req: Request,res: Response) => {
    const { _id,title, content } = req.body;
   

    console.log(req.user?._id)

    const post: PostInterface = {
        _id,
        title,
        content,
        author: req.user?._id
    };

    try {
        const result = connectionDB.query('INSERT INTO posts SET ?', [post]);

        if (result) {
            res.status(201).json({ success: true, data: post });
        } else {
            throw new Error('Failed to create post');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

export const updatePost =  async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const postId = req.params.id;
  
    const row = connectionDB.query('SELECT * from posts where _id=?', [req.params.id]) 
    if(!row){
        return res.status(404).json({ success: false, error: 'Post not found' });
    }

    try {
      const post: PostInterface = {
        _id: Number(req.params.id),
        title,
        content,
        author: req.user?._id,
      };
  
      connectionDB.query('UPDATE posts SET ? WHERE _id = ?', [post, postId]);
  
      res.status(200).json({ success: true, data: post });
    } catch (err) {
      res.status(500).json({ err });
    }
}

export const deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
        connectionDB.query(`DELETE FROM posts WHERE _id=? AND author=?`,[id, req.user?._id], (err, msg) => {
            if(err){
                return res.status(400).json({err: err})
            }else{
                res.status(200).json({msg: "Deleted Successfully"})
            }
        })
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  }