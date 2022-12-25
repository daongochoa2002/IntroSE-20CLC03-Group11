const mongoose = require('mongoose')
const slugify = require('slugify')

const drugSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },	
    slug: {
        type: String,
        unique: true
    }
});

drugSchema.pre('validate', function(next) {
    if (this.name) {
      this.slug = slugify(this.name, { lower: true, strict: true })
    }
    next()
})

var drug = mongoose.model('Drug', drugSchema);

module.exports = drug;