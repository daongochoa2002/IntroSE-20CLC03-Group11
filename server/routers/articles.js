const express = require('express')
const Article = require("../database/models/article")
const router = express.Router()
const auth = require("../middleware/identification")
const {TOKEN_HASH_KEY} = require("../constants")
const User = require("../database/models/user");
const jwt = require("jsonwebtoken");

router.get('/articles/new', auth, (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/articles/edit/:id', auth, async (req, res) => {
  const article = await Article.findById(req.params.id)
  console.log(article)
  res.render('articles/edit', { article: article })
})

router.get('/articles/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/articles')
  res.render('articles/show', { article: article })
})

router.get('/articles', async (req, res) => {
  let userId = ""
  const token = req.cookies["Authorization"];
  if(token && token !== ""){
    const decode = jwt.verify(token, TOKEN_HASH_KEY);
    const user = await User.findOne({_id: decode._id});
    if(user){
        userId = user._id;
    }
  }
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', {
    userId: userId,
    articles: articles
  })
})

router.post('/articles', auth, async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/articles/:id', auth, async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/articles/:id', auth, async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/articles')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.ownerId = req.user._id
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      const f_article = await Article.findById(article.id)
      if (f_article == null)
        article = await Article.insertMany([article]);
      else article = await Article.updateOne(f_article,article);


      
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router