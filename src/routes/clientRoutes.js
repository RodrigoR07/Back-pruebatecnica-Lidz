const express = require('express');
const router = express.Router();
const { getClients, getClientById, createClient } = require('../controllers/clientController');

router.get('/clients', getClients);
router.get('/clients/:id', getClientById);
router.post('/client', createClient);

module.exports = router;