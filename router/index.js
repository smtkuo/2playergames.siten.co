const express = require('express')
const Router = express.Router()
const indexController = require('../controllers/indexController')
const seoController = require('../controllers/seoController')
const apiController = require('../controllers/apiController')



// PWA
Router.get('/manifest.json', seoController.manifest)

// Robots.txt 
Router.get('/robots.txt', seoController.robotstxt)

// SITEMAP
Router.get('/sitemap.xml', seoController.sitemap)
Router.get('/sitemap-categories.xml', seoController.sitemapCategories)
Router.get('/sitemap-tags.xml', seoController.sitemapTags)
Router.get('/sitemap-games.xml', seoController.sitemapGames)

// RSS
Router.get('/rss', seoController.rss)

// API
Router.get('/api/tags', apiController.apiTags)
Router.get('/api/categories', apiController.apiCategories)
Router.get('/api/games', apiController.apiGames)

// PAGES
Router.get('/play-game/:gid', indexController.playgame)
Router.get('/search/:search', indexController.home)
Router.get('/search/:search/:page', indexController.home)
Router.get('/cat/:category', indexController.home)
Router.get('/cat/:category/:page', indexController.home)
Router.get('/tag/:tag', indexController.home)
Router.get('/tag/:tag/:page', indexController.home)

Router.get('/gameview.php', indexController.gameview)
Router.get('/update', indexController.update)
Router.get('/search', indexController.home)
Router.get('/', indexController.home)
Router.get('/:q', indexController.home)

module.exports = Router