const config = require('../config')
const async = require('async')
const request = require('request-promise')
const fs = require('fs')
const Object = require('../helpers/object')
const File = require('../helpers/file')
const bilgisam = require('bilgisam-projects')
const Games = (new bilgisam()).get({
	project: "./Projects/GamePlatform/services/games"
})
const indexController = (new bilgisam()).get({
	project: "./Projects/GamePlatform/controllers/index"
})

const Cache = {};

exports.home = async (req, res, next) => {
	try {
		return indexController.index(req, res, next, async function (err, results, data, query, req, res) {
			if(query.pageNum == null){
				query.pageNum = 1;
			}
			data.breadcrumbs = []
			// Default Meta
			data['meta'] = {
				title: process.env.PROJECT_Title + " | " + process.env.PROJECT_ShortDescription,
				description: process.env.PROJECT_Description,
				url: process.env.PROJECT_Main + "/",
				robots: (process.env.PROJECT_Search == 1) ?  "index,follow,max-image-preview:large" : "noindex,nofollow"
			}
			data['meta'] = Object.index.meta(data['meta'], "title", Object.index.toTitleCase) 
			data['meta'] = Object.index.meta(data['meta'], "description", Object.index.toDescriptionCase) 
			data["breadcrumbs"].push(data['meta'])
			data['slug'] = "home"
	
			if (req.params.category != null) {
				data['meta'] = {
					title: query.categorysearch + " | " + process.env.PROJECT_ShortDescription,
					description: process.env.PROJECT_Title + ": " + query.categorysearch + ". Games: " + query.categorysearch + " categories.",
					url: process.env.PROJECT_Main + "/cat/" + query.categorysearch,
					robots: (process.env.PROJECT_Search == 1) ?  "index,follow,max-image-preview:large" : "noindex,nofollow"
				}
				data['meta'] = Object.index.meta(data['meta'], "title", Object.index.toTitleCase) 
				data['meta'] = Object.index.meta(data['meta'], "description", Object.index.toDescriptionCase) 
				data['slug'] = "category-"+ query.categorysearch

				if(query.pageNum != null){
					data['meta'] = {
						title: query.categorysearch + " | " + process.env.PROJECT_ShortDescription,
						description: process.env.PROJECT_Title + ": " + query.categorysearch + ". Games Page: " + query.pageNum + ". " + query.categorysearch + " game category.",
						url: process.env.PROJECT_Main + "/cat/" + query.categorysearch + "/" +query.pageNum,
						robots: (process.env.PROJECT_Search == 1) ?  "index,follow,max-image-preview:large" : "noindex,nofollow"
					}
					if(query.pageNum>1){
						data['meta']["title"] +=  " Page: " + query.pageNum
					}else{
						data['meta']["url"] = process.env.PROJECT_Main + "/cat/" + query.categorysearch
					}
					data['meta'] = Object.index.meta(data['meta'], "title", Object.index.toTitleCase) 
					data['meta'] = Object.index.meta(data['meta'], "description", Object.index.toDescriptionCase) 
					data["breadcrumbs"].push(data['meta'])
					data['slug'] = "category-"+ query.categorysearch+query.pageNum
				}
			}
	
			if (req.params.tag != null) {
				query.tagsearch = req.params.tag
	
				data['meta'] = {
					title: query.tagsearch + " | " + process.env.PROJECT_ShortDescription,
					description: process.env.PROJECT_Title + ": " + query.tagsearch + ". Games: " + query.tagsearch + " tags.",
					url: process.env.PROJECT_Main + "/tag/" + query.tagsearch,
					robots: (process.env.PROJECT_Search == 1) ?  "index,follow,max-image-preview:large" : "noindex,nofollow"
				}
				data['meta'] = Object.index.meta(data['meta'], "title", Object.index.toTitleCase) 
				data['meta'] = Object.index.meta(data['meta'], "description", Object.index.toDescriptionCase) 
				data['slug'] = "tag-"+ query.tagsearch

				if(query.pageNum != null){
					data['meta'] = {
						title: query.tagsearch + " | " + process.env.PROJECT_ShortDescription,
						description: process.env.PROJECT_Title + ": " + query.tagsearch + ". Games Page: " + query.pageNum+". "+query.tagsearch+" tags.",
						url: process.env.PROJECT_Main + "/tag/" + query.tagsearch + "/" +query.pageNum,
						robots: (process.env.PROJECT_Search == 1) ?  "index,follow,max-image-preview:large" : "noindex,nofollow"
					}
					if(query.pageNum>1){
						data['meta']["title"] +=  " Page: " + query.pageNum
					}else{
						data['meta']["url"] = process.env.PROJECT_Main + "/tag/" + query.tagsearch
					}
					data['meta'] = Object.index.meta(data['meta'], "title", Object.index.toTitleCase) 
					data['meta'] = Object.index.meta(data['meta'], "description", Object.index.toDescriptionCase) 
					data["breadcrumbs"].push(data['meta'])
					data['slug'] = "tag-"+ query.tagsearch+query.pageNum
				}
			}
	
			if (req.params.q != null) {
				if(query.pageNum != null){
					data['meta'] = {
						title: process.env.PROJECT_Title + " | " + process.env.PROJECT_ShortDescription,
						description: process.env.PROJECT_ShortDescription + ". Games Page: " + query.pageNum + ".",
						url: process.env.PROJECT_Main + "/" + req.params.q,
						robots: (process.env.PROJECT_Search == 1) ?  "index,follow,max-image-preview:large" : "noindex,nofollow"
					}
					if(query.pageNum>1){
						data['meta']["title"] +=  " Page: " + query.pageNum
					}else{
						data['meta']["url"] = process.env.PROJECT_Main
					}
					data['meta'] = Object.index.meta(data['meta'], "title", Object.index.toTitleCase) 
					data['meta'] = Object.index.meta(data['meta'], "description", Object.index.toDescriptionCase) 
					data["breadcrumbs"].push(data['meta'])
					
					data['slug'] = "page-"+ query.pageNum
				}
			}
	
			if (query.keyword != null) {
				data['meta'] = {
					title: query.keyword + " | " + process.env.PROJECT_ShortDescription,
					description: process.env.PROJECT_Title + " | " + query.keyword + ". Games Page: " + query.pageNum + ".",
					url: process.env.PROJECT_Main + "/search?q=" + Object.index.convertToSlug(query.keyword),
					robots: (process.env.PROJECT_Search == 1) ?  "index,follow,max-image-preview:large" : "noindex,nofollow"
				}
				data['meta'] = Object.index.meta(data['meta'], "title", Object.index.toTitleCase) 
				data['meta'] = Object.index.meta(data['meta'], "description", Object.index.toDescriptionCase) 
				data['slug'] = "search-"+ query.keyword

				if(query.pageNum != null && query.pageNum>1){
					data['meta'] = {
						title: query.keyword + " | " + process.env.PROJECT_ShortDescription,
						description: process.env.PROJECT_Title + " | " + query.keyword + ". Games Page: " + query.pageNum + ".",
						url: process.env.PROJECT_Main + "/search?q=" + Object.index.convertToSlug(query.keyword) + "&page=" + query.pageNum,
						robots: (process.env.PROJECT_Search == 1) ?  "index,follow,max-image-preview:large" : "noindex,nofollow"
					}
					
					if(query.pageNum>1){
						data['meta']["title"] +=  " Page: " + query.pageNum
					}else{
						data['meta']["url"] = process.env.PROJECT_Main + "/search?q=" + Object.index.convertToSlug(query.keyword)
					}

					data['meta'] = Object.index.meta(data['meta'], "title", Object.index.toTitleCase) 
					data['meta'] = Object.index.meta(data['meta'], "description", Object.index.toDescriptionCase) 
					data["breadcrumbs"].push(data['meta'])
					data['slug'] = "search-"+ query.keyword + query.pageNum
				}
			}
	
			// Tag
			data['gameTagsHtml'] = new require('../lib/components/gametag.js')(data, query);
	
			// CATEGORIES
			var gameCategories = new require('../lib/components/gamecategories.js')(data, query)
			data['gameCategoriesLinks'] = gameCategories['gameCategoriesLinks'];
			data['gameCategoriesHtml'] = gameCategories['gameCategoriesHtml'];
	
			// GAME
			var getGameHtml = new require('../lib/components/gamehtml.js')(data, query)
			data['gameHtml'] = getGameHtml['gameHtml']
		
			data['randomGamesHtml'] = getGameHtml['randomGamesHtml'] ?? ""
			data['gameSuggestionHtml'] = getGameHtml['gameSuggestionHtml'] ?? ""
			data['isGameFound'] = getGameHtml['isGameFound']
			
			if(data['isGameFound'] == null){
				if(data['meta']['robots'] != null){
					data['meta']['robots'] = "noindex,follow";
				}
			}
	
	
			if(data['meta']["description"] != null && getGameHtml['gameListDescription'] != null){
				data['meta']["description"] += Object.index.encodeHTML(getGameHtml['gameListDescription']);
				data['meta'] = Object.index.meta(data['meta'], "description", Object.index.toDescriptionCase) 
			}
	
			data['meta']["image"] =   process.env.PROJECT_Main + '/icon.png';
			if(getGameHtml['gameListImage'] != null){
				data['meta']["image"] = getGameHtml['gameListImage'];
			}
			// String replace
			if (query.categorysearch != null) query.categorysearch = query.categorysearch.replaceAll(' ','-')
	
			if (query.notfound == 1) {
				
				if(data['meta']['robots'] != null){
					data['meta']['robots'] = "noindex,follow";
				}
				res.render("./pages/notfound", { theme: config.theme, query: query, data: data })
				return;
			}
	
			// Breadcrumbs
			data['insertBreadcrumbs'] = new require('../lib/components/insertbreadcrumbs.js')(data, query)["insertBreadcrumbs"];
			
			var specialContentApi = process.env.SPECIAL_Content_API+"?q=api&slug="+data['slug']+"&site="+process.env.SPECIAL_Content_URL
			console.log(specialContentApi)
			await request(specialContentApi, function (error, response, body) {
				var object = Object.index.tryParseJSONObject(body)
				if(object['success'] == 1){
					if(object['data']['content'] != null){
						data['specialContent']  = object['data']['content']
						data['meta']["description"] = object['data']['description']
						data['meta'] = Object.index.meta(data['meta'], "description", Object.index.toDescriptionCase) 
					}
				}
			});
			res.render("./pages/index", { theme: config.theme, query: query, data: data })
		})
	  } catch (err) {
		console.log(err)
	  }
	
}


exports.playgame = (req, res, next) => {
	return indexController.playgame(req, res, next, async function (err, results, data, query, req, res) {
		data["breadcrumbs"] = [];
		// Default Meta
		data['meta'] = {
			title: process.env.PROJECT_Title + " | " + process.env.PROJECT_ShortDescription,
			description: Object.index.encodeHTML(process.env.PROJECT_Description),
			url: process.env.PROJECT_Main + "/",
			robots: (process.env.PROJECT_Search == 1) ?  "index,follow,max-image-preview:large" : "noindex,nofollow"
		}
		data["breadcrumbs"].push(data['meta'])

		data['playGameHTML'] = `<div class="py-2">`;
		if (data['viewGame'] != null) {
			var GameDetail = data['viewGame']
			if(GameDetail['Title'] == null){
				return res.redirect('/');
			}
			data['meta'] = {
				title: GameDetail['Title'].slice(0, 150) + " | Play Game | "+ process.env.PROJECT_Title,
				description: process.env.PROJECT_Title + ": " + (GameDetail['Title'] + ", " + Object.index.encodeHTML(GameDetail['Description']).slice(0, 150)) + "...",
				url: process.env.PROJECT_Main + "/play-game/" + req.params.gid,
				robots: (process.env.PROJECT_Search == 1) ?  "index,follow,max-image-preview:large" : "noindex,nofollow"
			}
			data['meta'] = Object.index.meta(data['meta'], "title", Object.index.toTitleCase) 
			data['meta'] = Object.index.meta(data['meta'], "description", Object.index.toDescriptionCase) 

			data["breadcrumbs"].push(data['meta'])

			var GameImage = Object.index.tryParseJSONObject(GameDetail['Asset'])
			var GameImageView = GameImage[0]
			if (GameImage[1] != null) {
				GameImageView = GameImage[1]
			}

			var GameLinks = ''
			var GameCategories = Object.index.tryParseJSONObject(GameDetail['Category'])
			var GameTags = Object.index.tryParseJSONObject(GameDetail['Tag'])

			for(var key in GameCategories){
				var val = GameCategories[key]
				val = val.replaceAll(' ','-')
				val = val.replaceAll('#','')
				GameLinks += `
				<a href='${process.env.PROJECT_Main}/cat/${val}' class="btn btn-sm glass m-1"><i class="fa fa-gamepad m-1" aria-hidden="true"></i> ${val.replaceAll('-', ' ')}</a>
				`
			}
			for(var key in GameTags){
				var val = GameTags[key]
				val = val.replaceAll(' ','-')
				val = val.replaceAll('#','')
				GameLinks += `
				<a href='${process.env.PROJECT_Main}/tag/${val}' class="btn btn-sm glass m-1"><i class="fa fa-tag m-1" aria-hidden="true"></i> ${val.replace('-', ' ')}</a>
				`
			}
			

			var GameCompany = GameDetail['Company']

			// slug check
			var slugs = query.parameter.slice()
			slugs.shift()
			if (slugs.join("-") != Object.index.convertToSlug(GameDetail["Title"])) {
				return res.redirect('/play-game/' + query.parameter[0] + "-" + Object.index.convertToSlug(GameDetail["Title"]));
			}
			//${Object.index.convertToSlug(value["Title"])}
			// IMAGES
			var GameImageView = ""
			var imageFileName = './public/images/' + Object.index.convertToSlug(GameDetail['id'] + "-" + GameDetail['Title']) + ".jpeg"
			var imageFileNameOptimized = './public/images/cp/' + Object.index.convertToSlug(GameDetail['id'] + "-" + GameDetail['Title']) + ".jpeg"
			if (fs.existsSync(imageFileNameOptimized)) {
				// Optimized Image
				GameImageView = process.env.PROJECT_Main + '/images/cp/' + Object.index.convertToSlug(GameDetail['id'] + "-" + GameDetail['Title']) + ".jpeg"
			} else if (fs.existsSync(imageFileName)) {
				// Standart Image
				GameImageView = process.env.PROJECT_Main + '/images/' + Object.index.convertToSlug(GameDetail['id'] + "-" + GameDetail['Title']) + ".jpeg"
			} else {
				// Remote Image
				if (GameDetail['Asset'] != null) {
					var GameImage = Object.index.tryParseJSONObject(GameDetail['Asset'])
					GameImageView = GameImage[0]
					for (var keyb in GameImage) {
						var valb = GameImage[keyb]
						if (Object.index.strstr(valb, "512x340.jpeg")) {
							GameImageView = valb;
							break;
						}
					}
					// IMAGE SAVE
					File.index.downloadImage(GameImageView, imageFileName, imageFileNameOptimized)
				}
			}
			
			data['meta']["image"] =   process.env.PROJECT_Main + '/icon.png';
			if(GameImageView != null && GameImageView != ""){
				data['meta']["image"] =   GameImageView;
			}

			// IMAGES END
			data['playGameHTML'] += `
			<div id="gamebuttons" class="p-2 py-6 gamebuttons" style="display:none;">
			<div class="alert glass">
			<button class="btn btn-active btn-primary" onclick="openFullscreen()"><i class="fa fa-arrows-alt m-1" aria-hidden="true"></i> Fullscreen</button>
			</div>
			</div>

			<div class="p-2 py-6">
			<div id="gameLoad" class="alert glass gameLoad" style="height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden;">
			<div id="gameplay"></div>
			</div>
			</div>

			<div class="p-2 py-6">
			<div class="alert glass">
			<div class="text-primary-content md:w-80 flex-col"><p style="display:block;"><img alt="${GameDetail['Title']}" src="${GameImageView}" style="max-width:150px;height:auto;" /></p><p style="display:block;">${GameDetail['Title']}</p><div class="max-h-48 overflow-auto">${GameLinks}</div></div>
			<p class="text-primary-content md:w-80 max-h-48 overflow-auto justify-start content-start flex-col">${Object.index.encodeHTML(GameDetail['Description'])}</p>
			<p class="text-primary-content md:w-80 max-h-48 overflow-auto justify-start content-start flex-col">${Object.index.encodeHTML(GameDetail['Instructions'])}</p>
			</div>
			</div>
			</div>
			`;

			data['gamePlayScripts'] = `var gameCod = '<iframe id="gameScreenSource" src="/gameview.php?q=g&gurl=${GameDetail['Url']}" title="Game" style="width:100%;height:${GameDetail['Height']}px;"></iframe>'`;

			// GAME
			data['GameDetail'] = GameDetail
			data["gameView"] = 1;
			data["hideMobileTitle"] = 1;
			
			var getGameHtml = new require('../lib/components/gamehtml.js')(data, query)
			data['gameHtml'] = getGameHtml['gameHtml']
			data['randomGamesHtml'] = getGameHtml['randomGamesHtml'] ?? ""
			data['gameSuggestionHtml'] = getGameHtml['gameSuggestionHtml'] ?? ""
			data['isGameFound'] = 0;
			data['playGameHTML'] += data['gameHtml']
			data['playGameHTML'] += data['gameSuggestionHtml']

			// Tag
			data['gameTagsHtml'] = new require('../lib/components/gametag.js')(data, query);

			// CATEGORIES
			var gameCategories = new require('../lib/components/gamecategories.js')(data, query)
			data['gameCategoriesLinks'] = gameCategories['gameCategoriesLinks'];
			data['gameCategoriesHtml'] = gameCategories['gameCategoriesHtml'];

			// String replace
			if (query.categorysearch != null) query.categorysearch = query.categorysearch.replace(" ", "-")

			if (query.notfound == 1) {
				if(data['meta']['robots'] != null){
					data['meta']['robots'] = "noindex,nofollow";
				}
				res.render("./pages/notfound", { theme: config.theme, query: query, data: data })
			}

			data['insertBreadcrumbs'] = new require('../lib/components/insertbreadcrumbs.js')(data, query)["insertBreadcrumbs"];

			res.render("./pages/playgame", { theme: config.theme, query: query, data: data })
		}
	})
};

exports.update = indexController.update

exports.gameview = indexController.gameview
