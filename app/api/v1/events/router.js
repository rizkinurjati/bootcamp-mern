const express = require('express');
const router = express();
const { create, index, find, destroy, update, changeStatus } = require('./controller');
const {
  authenticateUser,
  authorizeRoles,
} = require('../../../middleware/auth');

router.get('/events/', authenticateUser, authorizeRoles('organizer', 'admin'), index);
router.get(
  '/events/:id',
  authenticateUser,
  authorizeRoles('organizer', 'admin'),
  find
);
router.put(
  '/events/:id',
  authenticateUser,
  authorizeRoles('organizer', 'admin'),
  update
);
router.delete(
  '/events/:id',
  authenticateUser,
  authorizeRoles('organizer', 'admin'),
  destroy
);
router.post(
  '/events/',
  authenticateUser,
  authorizeRoles('organizer', 'admin'),
  create
);

router.put(
  '/events/:id/status',
  authenticateUser,
  authorizeRoles('organizer'),
  changeStatus
);


module.exports = router;