const express = require('express');
const router = express.Router();

// @route     GET api/auth
// @desc      Test Route
// @access    Public
router.get('/', (req, res) => {
  res.status(200).json({ msg: 'Auth Test Route' });
});

module.exports = router;
