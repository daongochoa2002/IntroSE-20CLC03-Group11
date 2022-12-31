// const { MongoClient } = require('mongodb')
const mongoose = require('mongoose')
// const { countDocuments } = require('../models/user')
const url = 'mongodb://127.0.0.1/'

mongoose.connect('mongodb://127.0.0.1/IntroSEGroup11', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})