const express = require('express');
const router = express.Router();
User = require('../model/user')
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res) => {
  const { email, password } = req.body;
  if (!email | !password) {
    return res.status(422).json({ error: 'Please add all the fields' });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: 'User already exists with that email' });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        req.body.password = hashedpassword;
        const user = new User(req.body);

        user.save()
          .then((user) => {
            return res.status(201).json({
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

router.post('/signin', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: 'please add email or password' });
  }
  try {
    const data = await User.findOne({ email: email }).lean();
    if (data) {
      console.log(password, data.password)
      bcrypt
        .compare(password, data.password)
        .then((doMatch) => {
          console.log(doMatch, 'this')
          if (doMatch) {
            const token = jwt.sign({ _id: data._id }, 'SECRET');
            const { _id, fname, email } = data;
            res.status(200).json({
              statusCode: 200,
              token,
              user: {
                _id,
                fname,
                email,
              },
            });
          } else {
            console.log('here')
            return res.status(422).json({ error: 'Invalid Email or password' });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return res.status(422).json({ error: 'Invalid Email or password' });
    }
  } catch (err) {
    next(err)
  }

});

router.post('/update-profile/:userID', async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: userID }).lean()
    let resp;
    if (user !== null) {
      resp = await user.updateOne(...req.body)
      if (resp.nModified === 1) {
        return res.status(200).json({
          statusCode: 200,
          message: 'Successfully updated',
        })
      } else {
        return res.status(400).json({
          statusCode: 400,
          message: 'Internal server error',
        })
      }
    } else {
      return res.status(204).json({
        statusCode: 201,
        message: 'Target Data not found',
        body: resp
      })
    }
  } catch (err) {
    next(err)
  }

})

router.get('/search', async (req, res, next) => {
  try {
    console.log(req.query.text, "text")
    const data = await User.find({ $text: { $search: req.query.text } }).select("_id fname lname email mobile").lean()
    console.log(data, "data...")
    if (data && data.length > 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "successfully read",
        body: data
      })
    } else {
      return res.status(204).json({
        statusCode: 204,
        message: "Not Found any document",
        body: data
      })
    }
  } catch (err) {
    next(err)
  }

})

router.post('/matchmake', async (req, res, next) => {
  try {
    const data = await User.aggregate([
      {
        $match: { $or: [{ fname: req.body.name }, { lanme: req.body.name }, { age: req.body.age }, { gender: req.body.gender }, { interest: req.body.interest }, { location: req.body.location }, { religion: req.body.religion }] }
      },
      {
        $project: { _id: 1, fname: 1, lname: 1, age: 1, gender: 1, interest: 1, location: 1, religion: 1 }
      }
    ])
    if (data) {
      return res.status(200).json({
        statusCode: 200,
        message: "read Successfully",
        data: data
      })
    } else {
      return res.status(204).json({
        statusCode: 204,
        message: "Not Found",
        data: []
      })
    }
  } catch (err) {
    next(err)
  }

})


module.exports = router;