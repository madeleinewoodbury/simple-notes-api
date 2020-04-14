const express = require('express');
const router = express.Router();

// @route     GET api/notes
// @desc      Test Route
// @access    Public
router.get('/', (req, res) => {
  res.status(200).json({ msg: 'Notes Test Route' });
});

module.exports = router;
