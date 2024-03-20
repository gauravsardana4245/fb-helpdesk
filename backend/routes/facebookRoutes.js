const express = require('express');
const router = express.Router();
const facebookController = require('../controllers/facebookController');

router.post('/connect-facebook', facebookController.connectFacebook);
router.get('/get-connected-pages', facebookController.getConnectedPages);
router.post('/connect-page', facebookController.connectPage);
router.post('/disconnect-page', facebookController.disconnectPage);

module.exports = router;
