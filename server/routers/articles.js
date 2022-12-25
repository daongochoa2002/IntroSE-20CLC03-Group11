const express = require('express')
const Article = require("../database/models/article")
const User = require("../database/models/user");
const router = express.Router()
const auth = require("../middleware/identification");
const {getUserData} = require("../utils");

router.route('/articles').get(async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  const user = await getUserData(req);
  console.log("user:: " + JSON.stringify(user))
  let role = null;
  if(user)
    role = user.role;
  console.log("role:: " + role)
  res.render('articles/index', { articles: articles,userId: req.user, role: role})
})


router.route('/articles/new').get(auth, (req, res) => {
  res.render('articles/new', { article: new Article(), role: req.user.role })
})

router.route('/articles/edit/:id').get(auth, async (req, res) => {
  const article = await Article.findById(req.params.id)

  if(article.author==req.user.id) {
    const user = await User.findById(article.author)
    res.render('articles/edit', { article: article, user: user, role: user.role })
  }
    
  else console.log('Permission denied!')
})

router.route('/articles/my_articles').get(auth, async (req, res) => {
  const articles = await Article.find({author: req.user.id}).sort({ createdAt: 'desc' })
  res.render('articles/my_articles', { articles: articles, role: req.user.role})
})

router.route('/articles/:slug').get(auth, async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/articles')
  res.render('articles/show', { article: article, role: req.user.role })
})

router.route('/articles').post(auth, async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.route('/articles/:id').put(auth, async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.route('/articles/:id').delete(auth, async (req, res) => {
  req.article = await Article.findById(req.params.id)
  if(req.article.author==req.user.id) 
    await Article.findByIdAndDelete(req.params.id)
  res.redirect('/articles')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    article.author = req.user
    try {
      const f_article = await Article.findById(article.id)
      console.log(article)
      if (f_article == null)
        article = await Article.insertMany([article]);
      else article = await Article.updateOne(f_article,article);
      res.redirect(`/articles/articles/${article.slug}`)
    } catch (e) {
      const user = await getUserData(req);
      let role = null;
      if(user)
        role = user.role
      res.render(`articles/${path}`, { article: article, role: role })
    }
  }
}

module.exports = router