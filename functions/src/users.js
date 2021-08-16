const admin = require('firebase-admin')
const creds = require('../crendentials.json')

function connectDb(){
  if(!admin.apps.length){ // we haven't already connected
    admin.initializeApp({
      credential: admin.credential.cert(creds)
    })
  }
  return admin.firestore()
}

exports.userSignup = (req, res) => {
  // check that email and password present in the request
  if(!req.body || !req.body.email || !req.body.password){
  res.status(400).send({
    message:'Invalid Request: missing email or password',
    status: 400,
    success: false
  })
  return
  } 
// connect to the database
const db = connectDb()
// if valid, then insert into database and return success
db.collection('users').doc(req.body.email.toLowerCase())
.set(req.body)
.then(() => {
  res.send({
    message: 'User created successfully',
    status: 200,
    success: true
  })
})
.catch(err => {
  res.status(500).send({
    message:'Error:' + err.message,
    status:500,
    success:false
  })
})

// if not valid, return an error
}


exports.userLogin = (req, res) => {
res.send('ok')
}