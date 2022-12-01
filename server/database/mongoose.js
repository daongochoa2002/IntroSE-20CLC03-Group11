// const { MongoClient } = require('mongodb')
const mongoose = require('mongoose')
// const { countDocuments } = require('../models/user')
const url = "mongodb://localhost:27017/"
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true

});