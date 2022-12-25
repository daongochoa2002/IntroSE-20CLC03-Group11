const express = require('express')
const Drug = require("../database/models/drug")
const router = express.Router()
const auth = require("../middleware/identification");
const {getUserData} = require("../utils");

router.route('/medicines').get(async (req, res) => {
  try {
    const user = await getUserData(req);
    console.log("medicines user:: " + JSON.stringify(user))
    console.log(user ? user.role : null)
    const drugs = await Drug.find().sort({ date: 'desc' })
    res.render('medicines/index', { drugs: drugs, role: user ? user.role : null})
  }catch (e){
    console.log(e);
  }
})


router.route('/medicines/new').get(auth, (req, res) => {
  try {
    if(req.user.role !== "Admin"){
      res.send("<h1>You are not allowed to view this page</h1>");
      return;
    }
    res.render('medicines/new', { drug: new Drug(), role: req.user.role})
  }catch (e){
    console.log(e);
  }
})

router.route('/medicines/edit/:id').get(auth, async (req, res) => {
  try {
    if(req.user.role !== "Admin"){
      res.send("<h1>You are not allowed to view this page</h1>");
      return;
    }
    const drug = await Drug.findById(req.params.id)
    res.render('medicines/edit', { drug: drug, role: req.user.role})
  }catch (e){
    console.log(e);
  }
})

router.route('/medicines/:slug').get(async (req, res) => {
  try {
    const user = await getUserData(req);
    const drug = await Drug.findOne({ slug: req.params.slug })
    if (drug == null) res.redirect('/medicines')
    res.render('medicines/show', { drug: drug, role: user ? user.role : null})
  }catch (e){
    console.log(e);
  }
})

router.route('/medicines').post(auth, async (req, res, next) => {
  try {
    req.drug = new Drug()
  } catch (e){
    console.log(e);
  }
  next()
}, saveDrugAndRedirect('new'))

router.route('/medicines/search').post(async (req, res, next) => {
  req.name = new String()
  next()
}, searchDrugAndRedirect('search'))

router.route('/medicines/:id').put(auth, async (req, res, next) => {
  try {
    req.drug = await Drug.findById(req.params.id)
  }catch (e){
    console.log(e);
  }
  next()
}, saveDrugAndRedirect('edit'))

router.route('/medicines/:id').delete(auth, async (req, res) => {
  try {
    req.drug = await Drug.findById(req.params.id)
    if(req.user.role)
      await Drug.findByIdAndDelete(req.params.id)
    res.redirect('/medicines')
  }catch (e){
    console.log(e);
  }
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
        const f_drug = await Drug.find({name:drug.name})
          console.log(f_drug)
      }else{
        if (f_drug == null){
          drug = await Drug.insertMany([drug]);
        } else drug = await Drug.updateOne(f_drug,drug);
      }
      res.redirect(`medicines/${drug[0].slug}`)
    } catch (e) {
      const user = await getUserData(req);
      let role = null;
      if(user)
        role = user.role;
      res.render(`medicines/${path}`, { drug : drug, role: role})
    }
  }
}

function searchDrugAndRedirect(path) {
  return async (req, res) => {
    let name = req.body.name
    let role = null;
    const user = await getUserData(req);
    if(user)
      role = user.role;
    try {
      console.log(name)
      const drugs = await Drug.find({name: { $regex: name, $options: "i" }})
      res.render("medicines/index", {drugs: drugs, role: role})
    } catch (e) {
      res.render(`medicines/${path}`, { name : name, role: role })
    }
  }
}
module.exports = router