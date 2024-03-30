const express = require('express');
const router = express.Router();
const Gig = require('../model/Gig');
const Feedback2 = require('../model/feedBack2');
// const Feedback = require('../model/Feedback');

// Define the timeSince function
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

// Route to get a specific gig and show the feedback form
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

// Handle feedback submission for a specific gig
router.post('/gigs/:id/feedback', async (req, res) => {
    try {
        const { name, email, country, message, starRating } = req.body;
        const gigId = req.params.id;

        const newFeedback = new Feedback2({
            gigId,
            name,
            email,
            country,
            message,
            starRating
        });

        await newFeedback.save();
        console.log(newFeedback)
        res.redirect('/gigs');
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).send('Failed to submit feedback. Please try again later.');
    }
});

// Route to render a general feedback form
router.get('/feedback', (req, res) => {
    const selectedRating = req.query.rating || ''; // Get the selected rating from query parameters (if any)
    res.render('feedback', { selectedRating: selectedRating });
});

// Handle submission of the general feedback form
router.post('/feedback', async (req, res) => {
    try {
        // Extract data from the request body
        const { name, email, country, message, starRating } = req.body;

        // Create a new feedback instance
        const newFeedback = new Feedback2({
            name,
            email,
            country,
            message,
            starRating
        });

        // Save the feedback to the database
        await newFeedback.save();

        // Redirect to a review page after submission
        res.redirect('/review/feedback');
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Failed to submit feedback. Please try again later.' });
    }
});

// Route to review all feedback
router.get('/review/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback2.find().sort({ createdAt: 'desc' });

        // Modify timestamps to display "Just now" if within the last minute
        feedbacks.forEach(feedback => {
            const seconds = Math.floor((new Date() - new Date(feedback.createdAt)) / 1000);
            feedback.prettyCreatedAt = seconds < 60 ? "Just now" : timeSince(feedback.createdAt);
        });

        res.render('ABD/feedb', { feedbacks: feedbacks }); // Pass feedbacks data to the template
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).send('Error fetching feedbacks');
    }
});


// Example route handler for rendering gig details with feedback pagination
router.get('/gigs/:id', async (req, res) => {
    try {
        // Retrieve the gig details from the database
        const gig = await Gig.findById(req.params.id);
        
        // Retrieve all feedbacks for the gig from the database
        const allFeedbacks = await Feedback2.find({ gigId: req.params.id });

        // Paginate the feedbacks
        const pageSize = 10; // Adjust the page size as needed
        const page = parseInt(req.query.page) || 1;
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const feedbackSlice = allFeedbacks.slice(startIndex, endIndex);

        // Calculate total number of pages for pagination
        const totalPages = Math.ceil(allFeedbacks.length / pageSize);

        // Render the gig-details.ejs template with necessary data
        res.render('gig-details', { gig: gig, feedbackSlice: feedbackSlice, currentPage: page, totalPages: totalPages });
    } catch (error) {
        console.error('Error fetching gig details:', error);
        res.status(500).send('Error loading gig details');
    }
});
module.exports = router;
