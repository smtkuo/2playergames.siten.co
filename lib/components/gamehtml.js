const fs = require('fs')
const Object = require('../../helpers/object')
const File = require('../../helpers/file')

module.exports = function (data, query) {
	var object = {}
	object['gameSuggestionHtml'] = ''
	object['gameHtml'] = ``
	
	if(data['gameCategoriesLinks'] != null){
		object['gameHtml'] += `<div class="flex flex-nowrap overflow-auto block md:hidden">${data['gameCategoriesLinks']}</div>`
	}
	if(data['hideMobileTitle'] == null){
		object['gameHtml'] += `
		<div class="m-2 overflow-auto block md:hidden">
			<div class="alert glass shadow-lg">
			<div>
				<span class="card-title text-primary-content">${data['meta']['title']}</span>
			</div>
			</div>
		</div>
	  `
	}

	object['gameHtml'] += `<div class="flex flex-wrap items-stretch self-center content-center place-content-center">`;
	object['gameListDescription'] = ''; 
	if (data['gamelist'][0] != null) {
		var i = 0;
		for (var key in data['gamelist'][0]) {
			try{

				var value = data['gamelist'][0][key]
				if (value['id'] == value["Title"] == null) { continue; }
				// IMAGES
				var GameImageView = ""
				var imageFileName = './public/images/' + Object.index.convertToSlug(value['id'] + "-" + value['Title']) + ".jpeg"
				var imageFileNameOptimized = './public/images/cp/' + Object.index.convertToSlug(value['id'] + "-" + value['Title']) + ".jpeg"
				if (fs.existsSync(imageFileNameOptimized)) {
					// Optimized Image
					GameImageView = process.env.PROJECT_Main + '/images/cp/' + Object.index.convertToSlug(value['id'] + "-" + value['Title']) + ".jpeg"
				} else if (fs.existsSync(imageFileName)) {
					// Standart Image
					GameImageView = process.env.PROJECT_Main + '/images/' + Object.index.convertToSlug(value['id'] + "-" + value['Title']) + ".jpeg"
				} else {
					// Remote Image
					if (value['Asset'] != null) {
						var GameImage = Object.index.tryParseJSONObject(value['Asset'])
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
	
				
				if(data['GameDetail']!= null){
					if(data['GameDetail']["Title"] == value["Title"]){
						continue;
					}
				}
				if(i<=7){
					object['gameListDescription'] += " "+Object.index.encodeHTML(value["Title"])
					if(i==7){ 
						object['gameListDescription'] += "."
					}else{
						object['gameListDescription'] += ","
					}
				}
				if(i<1){
					object['gameListImage'] = GameImageView
					object['gameListImageWidth'] = GameImageView
					object['gameListImageHeight'] = GameImageView
				}
	
				// IMAGES END
				object['gameHtml'] += `
					<div class="w-5/12 md:w-64 card glass m-2 cursor-pointer" onclick='window.location.href = "${process.env.PROJECT_Main}/play-game/${value['id']}-${Object.index.convertToSlug(value["Title"])}";'>
					<div class="w-full h-24 md:h-48">
					<figure class="w-full h-24 md:h-48"><img class="w-full h-24 md:h-48 lazyload" data-src="${GameImageView}" src="${process.env.PROJECT_Main}/assets/images/loading.gif" alt="${value["Title"] ?? ""}" /></figure>
					</div>
					<div class="text-center w-full p-1">
					<a href="${process.env.PROJECT_Main}/play-game/${value['id']}-${Object.index.convertToSlug(value["Title"])}" class="text-sm md:text-xl text-primary-content justify-center" title="${value["Title"]} Play Game">${value["Title"]}</a>
					</div>
					</div>
				`;
				object['gameSuggestionHtml'] += `
							<div class="m-2 my-6">
							<div class="alert glass">
							<div class="text-primary-content md:w-80 flex-col"><p style="display:block;"><img alt="${value["Title"] ?? ""}" src="${GameImageView}" style="max-width:150px;height:auto;" /></p><p style="display:block;">${value['Title']}</p><div><button onclick='window.location.href = "${process.env.PROJECT_Main}/play-game/${value['id']}-${Object.index.convertToSlug(value["Title"])}";' class="btn btn-active btn-primary font-bold text-2xl"> <i class="fa fa-gamepad m-1" aria-hidden="true"></i> Play Game !</button></div></div>
							<p class="text-primary-content md:w-80 max-h-48 overflow-auto justify-start content-start flex-col">${Object.index.encodeHTML(value['Description'])}</p>
							<p class="text-primary-content md:w-80 max-h-48 overflow-auto justify-start content-start flex-col">${Object.index.encodeHTML(value['Instructions'])}</p>
							</div>
							</div>
						`;
				object['isGameFound'] = 1
				i++
			}catch(e){
			}
		}
		object['gameListDescription'] += "..."
	}
	object['gameHtml'] += `</div>`;
	if(object['isGameFound'] == null && data['gameView'] == null){
		object['gameHtml'] += `
		<div class="p-2 py-6">
		<div class="alert glass">
		<div>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
		<div>
		<div class="font-bold card-title text-primary-content">Not Found</div>
		<div class="text-xs"></div>
		</div>
		</div>
		<div class="flex flex-row flex-wrap">
			<label for="modal-search" class="btn btn-sm rounded-btn m-1">
				<i class="fa fa-search m-1" aria-hidden="true"></i> Search
			</label>
			<label for="modal-categories" class="btn btn-sm rounded-btn m-1">
				<i class="fa fa-gamepad m-1" aria-hidden="true"></i> Categories
			</label>
			<label for="modal-tags" class="btn btn-sm rounded-btn m-1">
				<i class="fa fa-tags m-1" aria-hidden="true"></i> Tags
			</label>
			<button class="btn btn-sm" onclick="window.location.href = '${process.env.PROJECT_Main}';">Home</button>
		</div>
		</div>
		</div>
			`;
	}
	object['randomGamesHtml'] =  `
	<div class="p-2 py-6"> <div class="alert glass shadow-lg"> <div> <span class="card-title text-primary-content"><i class="fa fa-bullhorn m-1" aria-hidden="true"></i> Share</span> </div> <div class="addthis_inline_share_toolbox_txyg"></div> </div></div>
	`;
	object['randomGamesHtml'] += '<div class="p-2 py-6"> <div class="alert glass shadow-lg"> <div> <span class="card-title text-primary-content"><i class="fa fa-random m-1" aria-hidden="true"></i> Random Games</span> </div> </div></div>'; 
	object['randomGamesHtml'] += `<div class="flex flex-wrap items-stretch self-center content-center place-content-center">`;
	if (data['randomGamelist'][0] != null) {
		var i = 0;
		for (var key in data['randomGamelist'][0]) {
			var value = data['randomGamelist'][0][key]
			if (value['id'] == value["Title"] == null) { continue; }
			// IMAGES
			var GameImageView = ""
			var imageFileName = './public/images/' + Object.index.convertToSlug(value['id'] + "-" + value['Title']) + ".jpeg"
			var imageFileNameOptimized = './public/images/cp/' + Object.index.convertToSlug(value['id'] + "-" + value['Title']) + ".jpeg"
			if (fs.existsSync(imageFileNameOptimized)) {
				// Optimized Image
				GameImageView = process.env.PROJECT_Main + '/images/cp/' + Object.index.convertToSlug(value['id'] + "-" + value['Title']) + ".jpeg"
			} else if (fs.existsSync(imageFileName)) {
				// Standart Image
				GameImageView = process.env.PROJECT_Main + '/images/' + Object.index.convertToSlug(value['id'] + "-" + value['Title']) + ".jpeg"
			} else {
				// Remote Image
				if (value['Asset'] != null) {
					var GameImage = Object.index.tryParseJSONObject(value['Asset'])
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
			if(data['GameDetail']!= null){
				if(data['GameDetail']["Title"] == value["Title"]){
					continue;
				}
			}
			// IMAGES END
			object['randomGamesHtml'] += `
				<div class="w-5/12 md:w-64 card glass m-2 cursor-pointer" onclick='window.location.href = "${process.env.PROJECT_Main}/play-game/${value['id']}-${Object.index.convertToSlug(value["Title"])}";'>
				<div class="w-full h-24 md:h-48">
				<figure class="w-full h-24 md:h-48"><img class="w-full h-24 md:h-48 lazyload" data-src="${GameImageView}" src="${process.env.PROJECT_Main}/assets/images/loading.gif" alt="${value["Title"] ?? ""}" /></figure>
				</div>
				<div class="text-center w-full p-1 text-sm md:text-xl text-primary-content justify-center">
				${value["Title"]}
				</div>
				</div>
			`;
			i++
		}
	}
	object['randomGamesHtml'] += `</div>`;

	return object
}