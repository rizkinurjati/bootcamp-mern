const express = require('express');
const router  = express();
const { index,create,find,update,destroy } = require('./controller');
const { authenticateUser } = require('../../../middleware/auth');

router.get('/categories', authenticateUser, index);
router.post('/categories', authenticateUser, create);
router.get('/categories/:id', authenticateUser, find);
router.put('/categories/:id', authenticateUser, update);
router.delete('/categories/:id', authenticateUser, destroy);

module.exports = router;