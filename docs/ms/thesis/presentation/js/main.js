$(document).ready(function() {
  insertSidebar();
  var qs = getQueryStrings();
  if (qs["lang"] == "fa") {
    alert("سلام!");
  }
  if (qs["lang"] == "en") {
    alert("Hello!");
  }
});

function insertSidebar() {
  var page_number = 0;
  var total_pages = "" + ($(".step").size() - 1);
  $(".step").each(function(){
    if (++page_number !== 1) {
      $(this).addClass("have-sidebar").append($(".add-to-every-page").html());
      $(this).find(".page-number").append("<div class='page-number-container'>" + page_number + " / " + total_pages +"</div>");
    }
  });
}

function getQueryStrings() {
  var assoc  = {};
  var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
  var queryString = location.search.substring(1);
  var keyValues = queryString.split('&');
  for(var i in keyValues) {
    var key = keyValues[i].split('=');
    if (key.length > 1) {
      assoc[decode(key[0])] = decode(key[1]);
    }
  }
  return assoc;
}
