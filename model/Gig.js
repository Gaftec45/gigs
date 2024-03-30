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
    }
});

module.exports = mongoose.model('Gig', gigSchema);
