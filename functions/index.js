const functions = require("firebase-functions");
const express = require('express')
const cors = require('cors')
const { userSignup, userLogin, updateUser } = require('./src/users')

const app = express()
app.use(cors())
app.use(express.json())

// routes here....

app.post('/signup', userSignup)
app.post('/Login', userLogin)

app.patch('/profile', updateUser)

exports.app = functions.https.onRequest(app)

