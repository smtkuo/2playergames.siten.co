const config = require('../config')
const async = require('async')
const request = require('request')
const fs = require('fs')
const Object = require('../helpers/object')
const File = require('../helpers/file')
const bilgisam = require('bilgisam-projects')
const indexController = (new bilgisam()).get({
	project: "./Projects/GamePlatform/controllers/index"
})

const Cache = {};

exports.apiTags = (req, res, next) => {
	return indexController.index(req, res, next, async function (err, results, data, query) {
		res.json(data['gameTags']);
	})
}

exports.apiCategories = (req, res, next) => {
	return indexController.index(req, res, next, async function (err, results, data, query) {
		res.json(data['gameCategories']);
	})
}

exports.apiGames = (req, res, next) => {
	return indexController.index(req, res, next, async function (err, results, data, query) {
		res.json(data['gamelist']);
	})
}


