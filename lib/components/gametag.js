module.exports = function (data, query) {
	var gameTagHTML = `<div>`;
	if(data['gameTags'] != null){
		data['gameTags'].sort(() => Math.random() - 0.5)
		for(var key in data['gameTags']){
			if(key>25){
				break;
			}
			var value = data['gameTags'][key]
			value = value.replaceAll('#','').replaceAll(' ','-')
			if(value == ""){
				continue;
			}
			gameTagHTML += `
			<button onclick="location.href = '${process.env.PROJECT_Main}/tag/${value}';" class="btn btn-sm backdrop-blur-sm backdrop-brightness-125 btn-primary font-bold m-1" title="Play ${value.replace('-', ' ')} Games"><i class="fa fa-tag m-1" aria-hidden="true"></i> ${value.replaceAll('-',' ')} Games</button>
			`
		}
		gameTagHTML += `
			<label for="modal-tags" class="btn btn-sm backdrop-blur-sm backdrop-brightness-125 btn-primary font-bold m-1">
				<i class="fa fa-tags m-1" aria-hidden="true"></i> All Tags
			</label>
			`
	}
	gameTagHTML += `</div>`;
	return gameTagHTML
}