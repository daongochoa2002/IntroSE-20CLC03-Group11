const mongoose = require('mongoose')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const drugSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    condition:{
        type: String,
        required: true
    },	
    review:{
        type: String,
        required: true
    },	
    date:{
        type: Date,
        default: Date.now
    },	
    slug: {
        type: String,
        required: true,
        unique: true
      },
      sanitizedHtml: {
        type: String,
        required: true
      }
});

drugSchema.pre('validate', function(next) {
    if (this.name) {
      this.slug = slugify(this.name, { lower: true, strict: true })
    }

    if (this.review) {
        this.sanitizedHtml = dompurify.sanitize(this.review)
      }

    next()
})

var drug = mongoose.model('Drug', drugSchema);

module.exports = drug;