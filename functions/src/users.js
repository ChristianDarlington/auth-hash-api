const admin = require('firebase-admin')
const jwt = require('jsonwebtoken')
const creds = require('../crendentials.json')
const { secret } = require('../secrets')

function connectDb() {
  if (!admin.apps.length) {
    // we haven't already connected
    admin.initializeApp({
      credential: admin.credential.cert(creds),
    })
  }
  return admin.firestore()
}

exports.userSignup = (req, res) => {
  // check that email and password present in the request
  if (!req.body || !req.body.email || !req.body.password) {
    res.status(400).send({
      message: 'Invalid Request: missing email or password',
      status: 400,
      success: false,
    })
    return
  }
  // connect to the database
  const db = connectDb()
  // if valid, then insert into database and return success
  db.collection('users')
    .doc(req.body.email.toLowerCase())
    .set(req.body)
    .then(() => {
      const token = jwt.sign({ email: req.body.email }, secret)
      res.send({
        message: 'User created successfully',
        status: 200,
        success: true,
        token
      })
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error:' + err.message,
        status: 500,
        success: false,
      })
    })

  // if not valid, return an error
}

exports.userLogin = (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    res.status(400).send({
      message: 'Invalid Request: missing email or password',
      status: 400,
      success: false,
    })
    return
  }
  const db = connectDb()
  db.collection('users')
    .where('email', '==', req.body.email.toLowerCase())
    .where('password', '==', req.body.password)
    .get()
    .then(userCollection => {
      if (userCollection.docs.length) {
        const user = userCollection.docs[0].data()
        user.password = undefined
        const token = jwt.sign(user, secret)
        res.send({
          message: 'User logged in successfully',
          status: 200,
          success: false,
          user: user,
        })
      } else {
        res.status({
          message: 'Invalid email or password',
          status: 200,
          success: false,
          user: user,
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error: ' + err.message,
        status: 500,
        success: false,
      })
    })
}
