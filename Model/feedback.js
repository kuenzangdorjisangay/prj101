const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 10, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
