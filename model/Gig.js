const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
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
        // Include pricing package fields here
        basicTitle: String,
        basicDescription: String,
        basicPrice: Number,
        basicDeliveryDays: String,
        standardTitle: String,
        standardDescription: String,
        standardPrice: Number,
        standardDeliveryDays: String,
        premiumTitle: String,
        premiumDescription: String,
        premiumPrice: Number,
        premiumDeliveryDays: String,
    },
    imageUrl: String, // Optional, based on your needs
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Gig', gigSchema);
