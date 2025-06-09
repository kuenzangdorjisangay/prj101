const express = require('express');
const router = express.Router();
const Feedback = require('../Model/feedback');

// POST /feedback — Submit anonymous feedback
router.post('/', async (req, res) => {
  try {
    const { message, rating } = req.body;

    if (!message || typeof rating !== 'number' || rating < 1 || rating > 10) {
      return res.status(400).json({ message: 'Message and rating (1–10) are required.' });
    }

    const newFeedback = new Feedback({ message, rating });
    await newFeedback.save();

    res.status(201).json({ message: 'Thank you for your feedback!' });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /feedback — Get all feedbacks for admin
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
