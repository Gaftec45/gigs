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
        required : true
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
        basicDeliveryDays: Number, // Assuming it should be a number
        standardTitle: String,
        standardDescription: String,
        standardPrice: Number,
        standardDeliveryDays: Number, // Assuming it should be a number
        premiumTitle: String,
        premiumDescription: String,
        premiumPrice: Number,
        premiumDeliveryDays: Number, // Assuming it should be a number
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Gig', gigSchema);