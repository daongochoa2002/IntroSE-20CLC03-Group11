const express = require('express')
const Drug = require("../database/models/drug")
const router = express.Router()
const auth = require("../middleware/identification");

router.route('/medicines').get(async (req, res) => {
  const drugs = await Drug.find().sort({ date: 'desc' })
  res.render('medicines/index', { drugs: drugs})
})


router.route('/medicines/new').get(auth, (req, res) => {
  res.render('medicines/new', { drug: new Drug() })
})

router.route('/medicines/search').get(auth, (req, res) => {
  res.render('medicines/search', { name: new String() })
})

router.route('/medicines/edit/:id').get(auth, async (req, res) => {
  const drug = await Drug.findById(req.params.id)
  res.render('medicines/edit', { drug: drug})
})

router.route('/medicines/:slug').get(auth, async (req, res) => {
  const drug = await Drug.findOne({ slug: req.params.slug })
  if (drug == null) res.redirect('/medicines')
  res.render('medicines/show', { drug: drug  })
})

router.route('/medicines').post(auth, async (req, res, next) => {
  req.drug = new Drug()
  next()
}, saveDrugAndRedirect('new'))

router.route('/medicines/search').post(async (req, res, next) => {
  req.name = new String()
  next()
}, searchDrugAndRedirect('search'))

router.route('/medicines/:id').put(auth, async (req, res, next) => {
  req.drug = await Drug.findById(req.params.id)
  next()
}, saveDrugAndRedirect('edit'))

router.route('/medicines/:id').delete(auth, async (req, res) => {
  req.drug = await Drug.findById(req.params.id)
  if(req.user.role) 
    await Drug.findByIdAndDelete(req.params.id)
  res.redirect('/medicines')
})

function saveDrugAndRedirect(path) {
  return async (req, res) => {
    let drug = req.drug
    drug.name = req.body.name
    drug.condition = req.body.condition
    drug.review = req.body.review
    try {
      const f_drug = await Drug.findById(drug.id)
      console.log(path)
      if (path=='search'){
        console.log('ahahah')
        const f_drug = await Drug.find({name:drug.name})
          console.log(f_drug)
      }else{
        if (f_drug== null){
          drug = await Drug.insertMany([drug]);
        }
          
        else drug = await Drug.updateOne(f_drug,drug);
      }
      

      
      res.redirect(`medicines/${drug[0] .slug}`)
    } catch (e) {
      res.render(`medicines/${path}`, { drug : drug })
    }
  }
}

function searchDrugAndRedirect(path) {
  return async (req, res) => {
    let name = req.body.name
    try {
      console.log('djlsdgi')
      console.log(name)
      const f_drug = await Drug.find({name: { $regex: name, $options: "i" }})
      console.log(f_drug[0])
      res.redirect(`${f_drug[0] .slug}`)
    } catch (e) {
      res.render(`medicines/${path}`, { name : name })
    }
  }
}
module.exports = router