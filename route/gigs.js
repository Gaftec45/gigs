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
        const gigId = req.params.id;
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ error: 'Gig not found' });
        }
        const feedbacks = await Feedback.find({ gigId: gig._id });
        res.render('gig-details', { gig: gig, feedbacks: feedbacks });
    } catch (error) {
        console.error('Error retrieving gig:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/gigs/:id/feedback', async (req, res) => {
    try {
        const gigId = req.params.id;
        const feedbacks = await Feedback.find({ gigId: gigId });
        if (!feedbacks || feedbacks.length === 0) {
            return res.status(404).json({ message: 'No feedback found for this gig' });
        }
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error retrieving feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/gigs/:id/feedback', async (req, res) => {
    try {
        const gigId = req.params.id;
        const { rating } = req.body;
        if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Invalid rating value' });
        }
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ error: 'Gig not found' });
        }
        gig.rating = rating;
        await gig.save();
        res.redirect(`/gigs/${gigId}`);
    } catch (error) {
        console.error('Error rating gig:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;