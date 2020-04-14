const express = require('express');
const router = express.Router();

// @route     GET api/users
// @desc      Test Route
// @access    Public
router.get('/', (req, res) => {
  res.status(200).json({ msg: 'Users Test Route' });
});

module.exports = router;
