const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const Registration = mongoose.model('Registration');

router.get('/', (req, res) => {
  res.render('index', { title: 'Simple Kitchen' });
});

router.get('/form', (req, res) => {
  res.render('form', { title: 'Registration form' });
});

router.get('/registrations', (req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('registrations', { title: 'Listing registrations', registrations });
    })
    .catch(() => {
      res.send('Sorry! Something went wrong.');
    });
});

router.post('/register', 
  [
    check('name')
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),
    check('email')
      .isLength({ min: 1 })
      .withMessage('Please enter an email'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const registration = new Registration(req.body);
      registration.save()
        .then(() => {
          res.render('thankyou', { title: 'Thank you for your registration!' });
        })
        .catch((err) => {
          console.log(err);
          res.send('Sorry! Something went wrong.');
        });
    } else {
      res.render('form', {
        title: 'Registration form',
        errors: errors.array(),
        data: req.body,
      });
    }
  });

module.exports = router;
