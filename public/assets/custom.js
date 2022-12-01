GameSam = {
  categoriesCheck: function () {
    var insertHtml = ''
    var select = $(".categorySearch");
    $.get("/api/categories?s=" + select[0].value, function (data, status) {
      for (var key in data) {
        var valKey = data[key].replaceAll('#', '')
        var val = valKey.replaceAll('-', ' ')
        insertHtml += '<button class="btn btn-primary m-1" onclick=\'window.location.href = "/cat/' + valKey + '";\'>' + val + '</button>'
      }
      var selectInsertHtml = $(".categorylinks")
      selectInsertHtml.html(insertHtml)
    });
  },
  tagsCheck: function () {
    var insertHtml = ''
    var select = $(".tagsSearch");
    $.get("/api/tags?s=" + select[0].value, function (data, status) {
      for (var key in data) {
        var valKey = data[key].replaceAll('#', '')
        var val = valKey.replaceAll('-', ' ')
        insertHtml += '<button class="btn btn-primary m-1" onclick=\'window.location.href = "/tag/' + valKey + '";\'>' + val + '</button>'
      }
      var selectInsertHtml = $(".tagslinks")
      selectInsertHtml.html(insertHtml)
    });
  },
}

let images = document.querySelectorAll(".lazyload");
lazyload(images);



  
const installButton = document.querySelector('.downloadapp');
let beforeInstallPromptEvent
window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    console.log('asdasd')
    beforeInstallPromptEvent = e
    installButton.addEventListener("click", function (mouseEvent) {
        e.prompt();
    });
});

installButton.addEventListener("click", function (mouseEvent) {
  try{
    beforeInstallPromptEvent.prompt();
  }catch(e){}
});

window.addEventListener("load", () => {
  registerSW();
});

async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
     await navigator.serviceWorker.register('./sw.js');
    } catch (e) {
      console.log(`SW registration failed`);
    }
  }
}

(function (c, l, a, r, i, t, y) {
  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
  t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
  y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "el96h74w75");
