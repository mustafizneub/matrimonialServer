const express = require('express');
const router = express.Router();
User = require('../model/user')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

router.post('/signup', (req, res, next) => {
  console.log(req.body)
  const { email, password } = req.body;
  if (!email | !password) {
    return res.status(422).json({ error: 'Please add all the fields' });
  }
  User.findOne({ email: email })
    .then((savedUser, err) => {
      console.log(savedUser)
      if (err) {
        next(err)
      }
      if (savedUser) {
        return res.status(422).json({ error: 'User already exists with that email' });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        req.body.password = hashedpassword;
        const user = new User(req.body);

        user.save()
          .then((user, err) => {
            if (err) {
              next(err)
            }
            res.status(201).json({
              statusCode: 201,
              message: 'Signup successfully'
            });
          })

      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: 'please add email or password' });
  }
  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: 'Invalid Email or password' });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {

          const token = jwt.sign({ _id: savedUser._id }, 'SECRET');
          const {
            _id, name, email
          } = savedUser;
          res.json({
            token,
            user: {
              _id,
              name,
              email,
            },
          });
        } else {
          return res.status(422).json({ error: 'Invalid Email or password' });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});


module.exports = router;