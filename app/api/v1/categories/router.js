const express = require('express');
const router  = express();
const { index,create,find,update,destroy } = require('./controller');
const { authenticateUser, authorizeRoles } = require('../../../middleware/auth');

router.get('/categories', 
    authenticateUser,
    authorizeRoles('organizer'), 
    index
);
router.post('/categories', 
    authenticateUser,
    authorizeRoles('organizer'), 
    create
    );
router.get('/categories/:id', 
    authenticateUser,
    authorizeRoles('organizer'), 
    find
    );
router.put('/categories/:id', 
    authenticateUser, 
    authorizeRoles('organizer'), 
    update
    );
router.delete('/categories/:id', authenticateUser, destroy);

module.exports = router;