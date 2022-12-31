// const { MongoClient } = require('mongodb')
const mongoose = require('mongoose')
// const { countDocuments } = require('../models/user')
const url = "mongodb://localhost:27017/"
// mongoose.connect(url, {
//     useNewUrlParser: true,
//     useCreateIndex:true, //work together
//     useFindAndModify:false, // turn off warning
//     useUnifiedTopology: true
//
// })
mongoose.connect(url, () => {

})