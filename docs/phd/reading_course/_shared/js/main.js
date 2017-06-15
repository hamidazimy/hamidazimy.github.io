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
  var number_of_sections = $(".navigation .li").length;

  var section_number = 0;
  $(".navigation li a").each(function() {
    section_number++;
    var first_slide_of_section = $(".step").index($(".step.sec" + section_number)) + 1;
    $(this).prop("href", "#/step-" + first_slide_of_section);
  });

  var page_number = 0;
  var total_pages = "" + ($(".step").length - 1);
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
