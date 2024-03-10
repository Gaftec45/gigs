const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  Basic:{
    type : String,
    required: true
  },
  
  basicTitle:{
    type : String,
    required: true
  },
  basicDescription:{
    type: String,
    required: true
  },
  basicDeliveryDays:{
    type: String,
    required: true,
    enum: ['1day', '2day','3day','4day','5day','6day','7day','8day','9day','10day']
  },
  basicPrice: {
    type : Number,
    required: true
  },
  Standard:{
    type : String,
    required: true
  },
  
  StandardTitle:{
    type : String,
    required: true
  },
  StandardDescription:{
    type: String,
    required: true
  },
  standardDeliveryDays:{
    type: String,
    required: true,
    enum: ['1day', '2day','3day','4day','5day','6day','7day','8day','9day','10day']
  },
  StandardPrice: {
    type : Number,
    required: true
  },
  Premium:{
    type : String,
    required: true
  },
  
  PremiumTitle:{
    type : String,
    required: true
  },
  PremiumDescription:{
    type: String,
    required: true
  },
  premiumDeliveryDays:{
    type: String,
    required: true,
    enum: ['1day', '2day','3day','4day','5day','6day','7day','8day','9day','10day']
  },
  PremiumPrice: {
    type : Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);