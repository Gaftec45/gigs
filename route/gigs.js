const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const gigList = require('../model/Gig'); // Adjust the path based on your project structure
const feedBack = require('../model/feedBack');

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
    limits: { fileSize: 1000000 },
  }).single('imageUrl');

router.get('/create-gig', (req, res) => {
    res.render('createGig');});

router.get('/gigs', async (req, res) => {
    try {
        // Fetch gigs from your database or any other data source
        const gigs = await gigList.find(); // Example: Assuming you have a Gig model and you are using Mongoose
        
        // Render the `mainGigs.ejs` template and pass the `gigs` variable to it
        res.render('mainGigs', { gigs: gigs });
    } catch (err) {
        console.error('Error fetching gigs:', err);
        res.status(500).send('Error fetching gigs');
    }
});

// Handle form submission for a new gig
router.post('/create-gig', upload, async (req, res) => {
    try {
        const { title, description, pricingPackage,  category, subcategory } = req.body;
        const imageUrl = req.file ? req.file.path : '';
    /*    let imageUrl = '';
        if (req.file) {
            imageUrl = req.file.path; // Adjust based on your needs
        }*/
        const newGig = new gigList({ title, description, pricingPackage, category, subcategory,  imageUrl });
        await newGig.save();
        res.redirect('/gigs'); // Redirect to a page where you list all gigs or to the created gig
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Route to get a single gig by ID
router.get('/gigs/:id', async (req, res) => {
    try {
        // Retrieve the gig ID from the request parameters
        const gigId = req.params.id;

        // Query the database for the gig with the specified ID
        const gig = await gigList.findById(gigId);

        // Check if the gig exists
        if (!gig) {
            return res.status(404).json({ error: 'Gig not found' });
        }

        // Query the database for feedbacks related to this gig
        const feedbacks = await feedBack.find({ gigId: gig._id });

        // If the gig exists, render the gig-details template with the gig and feedbacks data
        res.render('gig-details', { gig: gig, feedbacks: feedbacks });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error retrieving gig:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/*
// GET route to retrieve a specific gig by ID and title
router.get('/gigs/:id/:title', async (req, res) => {
    try {
        // Retrieve the gig from the database using the provided ID
        const gig = await gigList.findById(req.params.id);

        // Check if the gig exists
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        // Check if the title in the URL matches the gig title
        if (req.params.title !== encodeURIComponent(gig.title)) {
            // Redirect to the correct URL with the encoded title
            return res.redirect(301, `/gigs/${gig._id}/${encodeURIComponent(gig.title)}`);
        }

        // If the title matches, render the gig details page
        res.render('gig-details', { gig: gig });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}); */

module.exports = router; 