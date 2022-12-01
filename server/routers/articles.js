const express = require('express')
const Article = require("../database/models/article")
const router = express.Router()

router.get('/articles/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/articles/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  console.log(article)
  res.render('articles/edit', { article: article })
})

router.get('/articles/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article })
})

router.get('/articles', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})

router.post('/articles', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/articles/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/articles/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
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