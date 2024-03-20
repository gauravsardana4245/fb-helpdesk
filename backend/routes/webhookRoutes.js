const express = require('express');
const router = express.Router();
const webhookRequestsController = require('../controllers/webhookRequestsController');

router.get('/', webhookRequestsController.handleGetRequest);
router.post('/', webhookRequestsController.handleEventReceival);

module.exports = router;