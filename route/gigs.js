const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Gig = require('../model/Gig');
const Feedback = require('../model/Feedback');

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

function timeSince(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) {
        return "Just now";
    } else if (seconds < 3600) {
        return `${Math.floor(seconds / 60)} minute${Math.floor(seconds / 60) > 1 ? 's' : ''} ago`;
    } else if (seconds < 86400) {
        return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
    } else {
        return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
    }
}

router.get('/create-gig', (req, res) => {
    res.render('createGig');
});

router.get('/gigs', async (req, res) => {
    try {
        const gigs = await Gig.find();
        res.render('mainGigs', { gigs: gigs });
    } catch (err) {
        console.error('Error fetching gigs:', err);
        res.status(500).send('Error fetching gigs');
    }
});

router.post('/create-gig', upload, async (req, res) => {
    try {
        const { title, description, pricingPackage, category, subcategory } = req.body;
        const imageUrl = req.file ? req.file.path : '';
        const newGig = new Gig({ title, description, pricingPackage, category, subcategory, imageUrl });
        await newGig.save();
        res.redirect('/gigs');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/gigs/:id', async (req, res) => {
    try {
        // Fetch the gig details from your database
        const gig = await Gig.findById(req.params.id);
        
        if (!gig) {
            return res.status(404).send('Gig not found');
        }

        // Fetch the total number of feedbacks for pagination purposes
        const totalFeedbackCount = await Feedback.countDocuments({ gigId: req.params.id });

        // Define how many feedbacks you want to show per page
        const feedbacksPerPage = 10;
        const totalPages = Math.ceil(totalFeedbackCount / feedbacksPerPage);

        // Assuming you have a way to determine the current page, perhaps from the query string
        let currentPage = req.query.page ? parseInt(req.query.page) : 1;

        // Fetch only the slice of feedbacks that should be displayed on the current page
        const feedbackSlice = await Feedback.find({ gigId: req.params.id })
                             .sort({ createdAt: 'desc' })
                             .skip((currentPage - 1) * feedbacksPerPage)
                             .limit(feedbacksPerPage);

        // Format timestamps into human-readable format for display
        feedbackSlice.forEach(feedback => {
            const seconds = Math.floor((new Date() - new Date(feedback.createdAt)) / 1000);
            feedback.prettyCreatedAt = seconds < 60 ? "Just now" : timeSince(feedback.createdAt);
        });

        // Pass currentPage, totalPages, and other necessary data to the view
        res.render('gig-details', { 
            gig: gig, 
            feedbackSlice: feedbackSlice, 
            currentPage: currentPage, 
            totalPages: totalPages 
        });
    } catch (error) {
        console.error('Error fetching gig details:', error);
        res.status(500).send('Server error');
    }
});


router.get('/gigs/:id/feedback', async (req, res) => {
    try {
        const gigId = req.params.id;
        const gig = await Gig.findById(gigId);

        if (!gig) {
            return res.status(404).send('Gig not found');
        }

        res.render('feedback', { gig: gig });
    } catch (error) {
        console.error('Error fetching gig details:', error);
        res.status(500).send('Error loading page');
    }
});

router.post('/gigs/:id/feedback', async (req, res) => {
    try {
        const gigId = req.params.id;
        let { starRating, name, email, country, message } = req.body;

        // Convert starRating to a number
        starRating = parseFloat(starRating);

        // Validate fields
        if (isNaN(starRating) || starRating < 1 || starRating > 5 || !name || !email || !country || !message) {
            return res.status(400).json({ error: 'Invalid form data' });
        }

        // Find the gig
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ error: 'Gig not found' });
        }

        // Update gig's rating or perform other necessary actions

        // Create a new Feedback instance
        const newFeedback = new Feedback({
            gigId,
            name,
            email,
            country,
            message,
            starRating
        });

        // Save the feedback
        const savedFeedback = await newFeedback.save();

        res.redirect(`/gigs/${gigId}`);
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;