const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
User = require('../model/user')
var bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken')

router.post('/signup', (req, res) => {
    const { email, password } = req.body;
    if (!email  |!password) {
    return res.status(422).json({ error: 'Please add all the fields' });
    }
    User.findOne({ email })
    .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: 'User already exists with that email' });
            }
            bcrypt.hash(password, 12).then((hashedpassword) => {
                const user = new User({
                    
                    email,
                    password: hashedpassword,
                });

                user.save()
                    .then((user) => {
                    
                        res.json({ message: 'Signup successfully' });
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


module.exports=router;