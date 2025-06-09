const { sendFeedback } = require('../Controller/feedback');
const express = require('express');
const router = express.Router();

router.post('/', sendFeedback);

module.exports = router;