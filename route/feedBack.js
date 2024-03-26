const express = require('express');
const router = express.Router();
const Feedback = require('../model/feedBack');

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

router.get('/feedback', (req, res) => {
    const selectedRating = req.query.rating || ''; // Get the selected rating from query parameters (if any)
    res.render('feedBack', { selectedRating: selectedRating });
});

// Handle feedback submission
router.post('/feedback', async (req, res) => {
    try {
        // Extract data from the request body
        const { name, email, country, message, starRating } = req.body;

        // Create a new feedback instance
        const newFeedback = new Feedback({
            name,
            email,
            country,
            message,
            starRating
        });

        // Save the feedback to the database
        await newFeedback.save();

        // Redirect to review page after submission
        res.redirect('/review/feedback');
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Failed to submit feedback. Please try again later.' });
    }
});

router.get('/review/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: 'desc' });

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

module.exports = router;