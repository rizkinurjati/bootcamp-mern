const express = require('express');
const router  = express();
const { createCMSOrganizer } = require('./controller');

router.post('/organizer', createCMSOrganizer);

module.exports = router;