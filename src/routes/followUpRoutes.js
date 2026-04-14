const express = require('express');
const router = express.Router();
const { clientFollowUp } = require('../controllers/followUpController');

router.post('/:id', clientFollowUp);

module.exports = router;