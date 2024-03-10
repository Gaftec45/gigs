require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./route/blog');
const gigRoute = require('./route/gigs')
const BlogPost = require('./model/Blog');
const Gig = require('./model/Gig');
const MONGOURI = process.env.MONGO_URI  || process.env.MONGO_URI2
// const bodyParser = require('body-parser')

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(MONGOURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

  app.set('view engine', 'ejs');

  app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(express.static('public')); // Serve static files

// Routes
app.use('/', gigRoute)
app.use('/', routes);
app.get('/', async (req, res) => {
    try {
      const blogPosts = await BlogPost.find().sort({ createdAt: 'desc' }); // Fetches all blog posts and sorts them by createdAt in descending order
      const gigs = await Gig.find().sort({ createdAt: 'desc' }); // Assuming you also want to sort gigs by createdAt
      // Merge blogPosts and gigs into a single object for rendering
      res.render('index', { blogs: blogPosts, gigs: gigs });
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});