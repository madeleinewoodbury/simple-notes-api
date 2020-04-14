const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// @route     GET api/notes
// @desc      Get user's notes
// @access    Public
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({
      date: -1,
    });

    if (notes.length < 1) {
      return res.status(400).json({ errors: [{ msg: 'No notes found' }] });
    }
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/notes/:id
// @desc    Get single note
// @acess   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(400).json({ msg: 'Note not found' });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: 'Not Authorized' });
    }

    res.status(200).json(note);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Note not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/notes
// @desc    Create a note
// @acess   Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('text', 'Text is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user is authorized
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'No user found' }] });
      }

      // Create new instance of note
      const newNote = new Note({
        user: req.user.id,
        title: req.body.title,
        text: req.body.text,
      });

      const note = await newNote.save();
      res.status(201).json(note);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     PUT api/notes/:id
// @desc      Update a note
// @access    Private
router.put(
  '/:id',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('text', 'Text is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let note = await Note.findById(req.params.id);
      if (!note) return res.status(404).json({ msg: 'Note not found' });

      // Make sure user owns note
      if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const { title, text } = req.body;

      // Build note object
      const noteFields = {};
      if (title) noteFields.title = title;
      if (text) noteFields.text = text;

      note = await Note.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: noteFields },
        { new: true }
      );

      res.json(note);
    } catch (err) {
      if (err.kind == 'ObjectId') {
        return res.status(400).json({ msg: 'Note not found' });
      }
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     DELETE api/notes/:id
// @desc      Delete note
// @access    Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ msg: 'Note not found' });

    // Make sure user owns note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Note.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Note removed' });
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Note not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
