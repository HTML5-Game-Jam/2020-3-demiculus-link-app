const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const Link = require('../models/link');

// Attempt to limit spam post requests for inserting data
const minutes = 5;
const postLimiter = new RateLimit({
  windowMs: minutes * 60 * 1000, // milliseconds
  max: 100, // Limit each IP to 100 requests per windowMs
  delayMs: 0, // Disable delaying - full speed until the max limit is reached
  handler: (req, res) => {
    res.status(429).json({ success: false, msg: `You made too many requests. Please try again after ${minutes} minutes.` });
  }
});

// READ (ONE)
router.get('/:id', (req, res) => {
  Link.findById(req.params.id)
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(404).json({ success: false, msg: 'No such link.' });
        });
});

// READ (ALL)
router.get('/', (req, res) => {
  Link.find({})
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(500).json({success: false, msg: `Something went wrong. ${err}`});
        });
});

// CREATE
router.post('/', postLimiter, (req, res) => {

    // Validate type
  let type = sanitizeType(req.body.type);
  if (type != 'Common') return res.status(403).json({success: false, msg: 'You can only add common type links'});

  let newLink = new Link({
    url: sanitizeURL(req.body.url),
    type: sanitizeType(req.body.type),
    tag: sanitizeTag(req.body.tag),
  });

  newLink.save()
        .then((result) => {
          res.json({
            success: true,
            msg: 'Successfully added!',
            result: {
              _id: result._id,
              url: result.url,
              type: result.type,
              tag: result.tag,
            }
          });
        })
        .catch((err) => {
          if (err.errors) {
            console.log(err);
            if (err.error.url) {
              res.status(400).json({success: false, msg: err.errors.url.message});
              return;
            }
            if (err.error.type) {
              res.status(400).json({success: false, msg: err.errors.type.message});
              return;
            }
            if (err.error.tag) {
              res.status(400).json({success: false, msg: err.errors.tag.message});
              return;
            }
            res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
          }
        });
});

// UPDATE
router.put('/:id', (req, res) => {

    // Validate type
  let type = sanitizeType(req.body.type);
  if (type === '') return res.status(403).json({success: false, msg: 'No such type'});

  let updatedLink = new Link({
    url: sanitizeURL(req.body.url),
    type: sanitizeType(req.body.type),
    tag: sanitizeTag(req.body.tag),
  });

  Link.findOneAndUpdate({ _id: req.params.id}, updatedLink, { runValidators: true, context: 'query'})
        .then((oldResult) => {
          Link.findOne({ _id: req.params.id})
                .then((newResult) => {
                  res.json({
                    success: true,
                    msg: 'Sucessfully updated!',
                    result: {
                      _id: newResult._id,
                      url: newResult.url,
                      type: newResult.type,
                      tag: newResult.tag,
                    }
                  });
                })
                .catch((err) => {
                  res.status(500).json({success: false, msg: `Something went wrong. ${err}`});
                  return;
                });
        })
        .catch((err) => {
          if (err.errors) {
            if (err.errors.url) {
              res.status(400).json({success: false, msg: err.errors.url.message});
              return;
            }
            if (err.error.type) {
              res.status(400).json({success: false, msg: err.errors.type.message});
              return;
            }
            if (err.error.tag) {
              res.status(400).json({success: false, msg: err.errors.tag.message});
              return;
            }
                // Show failed if all else fails for some reasons
            res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
          }
        });
});

// DELETE
// router.delete('/:id', (req, res) => {
//
//
//
//     User.findByIdAndRemove(req.params.id)
//         .then((result) => {
//             res.json({
//                 success: true,
//                 msg: `It has been deleted.`,
//                 result: {
//                     _id: result._id,
//                     name: result.name,
//                     email: result.email,
//                     age: result.age,
//                     gender: result.gender
//                 }
//             });
//         })
//         .catch((err) => {
//             res.status(404).json({ success: false, msg: 'Nothing to delete.' });
//         });
// });

module.exports = router;

// Minor sanitizing to be invoked before reaching the database

sanitizeURL = (url) => {
  return url;
};

sanitizeType = (type) => {
    // Return empty if it's one of the below
  return (type === 'Common' ||
            type === 'Daily' ||
            type === 'Weekly' ||
            type === 'Monthly' ||
            type === 'Yearly') ? type : '';
};

sanitizeTag = (tag) => {
    // TODO sanitize tags at some point
  return tag;
};
