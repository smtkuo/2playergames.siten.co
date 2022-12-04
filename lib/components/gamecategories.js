module.exports = function (data, query) {
    var object = {}
    object['gameCategoriesLinks'] = ``;
    object['gameCategoriesHtml'] = `<div class="flex flex-wrap items-stretch self-center content-center place-content-center">`;
    if (data['gameCategories'] != null) {
        data['gameCategories'].sort()
        for (var key in data['gameCategories']) {
            if (key > 25) {
                break;
            }
            var value = data['gameCategories'][key]
            value = value.replaceAll('#', '').replace(' ', '-')
            object['gameCategoriesHtml'] += `
				<button onclick="location.href = '${process.env.PROJECT_Main}/cat/${value}';" class="btn backdrop-blur-sm backdrop-brightness-125 btn-primary w-full my-2" title="Play ${value.replace('-', ' ')} Games"><i class="fa fa-gamepad m-1" aria-hidden="true"></i> ${value.replace('-', ' ')} Games</button>
				`
            object['gameCategoriesLinks'] += `<button onclick="location.href = '${process.env.PROJECT_Main}/cat/${value}';" class="btn backdrop-blur-sm backdrop-brightness-125 btn-primary m-1"><i class="fa fa-gamepad m-1" aria-hidden="true"></i> ${value.replaceAll('-', ' ')} Games</button>`;
        }
        object['gameCategoriesLinks'] += `
        <label for="modal-categories" class="btn backdrop-blur-sm backdrop-brightness-125 btn-primary m-1">
            <i class="fa fa-gamepad m-1" aria-hidden="true"></i> All Game Categories
        </label>
        `
        
    }
    object['gameCategoriesHtml'] += `</div>`;

    return object
}