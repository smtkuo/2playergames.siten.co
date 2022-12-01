exports.index = {
	tryParseJSONObject: function (jsonString){
		try {
			var o = JSON.parse(jsonString);
			if (o && typeof o === "object") {
				return o;
			}
		}
		catch (e) { 
		}
	
		return jsonString;
	},
	strstr(haystack, needle, bool) {
		var pos = 0;
	
		haystack += "";
		pos = haystack.indexOf(needle); if (pos == -1) {
			return false;
		} else {
			if (bool) {
				return haystack.substr(0, pos);
			} else {
				return haystack.slice(pos);
			}
		}
	},
	convertToSlug(Text) {
		return Text.toLowerCase()
				   .replace(/ /g, '-')
				   .replace(/[^\w-]+/g, '');
	},
	toTitleCase(str) {
		str = str.replaceAll('-', ' ')
		return str.replace(
		  /\w\S*/g,
		  function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		  }
		);
	},
	toDescriptionCase(str) {
		str = str.replaceAll('-', ' ')
		str = str.toLowerCase();
		return str.charAt(0).toUpperCase() + str.slice(1);
	},
	meta(Object={}, key="", f=function(string){return string}) {
		if(key == ""){
			for(var key in Object){
				var val = Object[key]
				Object[key] = f(val)
			}
		}else if(Object[key] != null){
			Object[key] = f(Object[key])
		}
		return Object;
	},
	encodeHTML: function(string = "") {
		return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&#34;").replace(/\'/g, "&#39;");
	}
}