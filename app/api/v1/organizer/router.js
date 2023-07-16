const express = require('express');
const router  = express();
const {
    createCMSOrganizer,
    createCMSUsers,
    getCMSUsers
  } = require('./controller');
  
  const {
    authenticateUser,
    authorizeRoles,
  } = require('../../../middleware/auth');
  

  router.post(
    '/organizer',
    authenticateUser,
    authorizeRoles('owner'),
    createCMSOrganizer
  );
  
  router.post(
    '/users',
    authenticateUser,
    authorizeRoles('organizer'),
    createCMSUsers
  );
  
  router.get('/users', authenticateUser, authorizeRoles('owner'), getCMSUsers);
  
module.exports = router;