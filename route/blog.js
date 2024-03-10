const express = require('express');
const multer = require('multer');
const path = require('path');
const BlogPost = require('../model/Blog');
const router = express.Router();


router.get('/create-blog', (req, res)=>{
    res.render('createBlog');
})

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // for example, limit file size to 1MB
    // Add file filter here if needed, to handle file types
  }).single('imageUrl'); // Make sure 'imageUrl' matches the name attribute in your form

// Route to display form to create a new blog post
router.get('/create-blog', (req, res) => {
  res.render('createBlog');
});

// Route to handle the creation of a blog post
router.post('/create-blog', upload, async (req, res) => {
    // Now Multer will handle the 'imageUrl' field upload, and the file will be available in req.file
    try {
      const { title, content, author } = req.body;
      const imageUrl = req.file ? req.file.path : ''; // Adjust according to how you want to handle the file path
  
      const newBlogPost = await BlogPost.create({ title, content, imageUrl, author});
      res.status(201).redirect('/'); // Or handle redirection/ response as needed
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

module.exports = router;