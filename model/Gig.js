const mongoose = require('mongoose');

// Define a sub-schema for feedback
const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    starRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Define the main gig schema
const gigSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Graphics & Designs', 'Programming & Tech', 'Digital Marketing', 'Video & Animation', 'Writing & Translation'],
    },
    subcategory: {
        type: String,
        required: true,
    },
    pricingPackage: {
        basicTitle: String,
        basicDescription: String,
        basicPrice: Number,
        basicDeliveryDays: Number,
        standardTitle: String,
        standardDescription: String,
        standardPrice: Number,
        standardDeliveryDays: Number,
        premiumTitle: String,
        premiumDescription: String,
        premiumPrice: Number,
        premiumDeliveryDays: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    feedbacks: [feedbackSchema], // Include the feedback sub-document within the gig schema
});

module.exports = mongoose.model('Gig', gigSchema);
