$(document).ready(function() {
  var qs = getQueryStrings();
  $('html').addClass("lang-" + qs["lang"]);
  insertSidebar();
  arrangeSlides();
  impress().init();
  impressConsole().init();
});

function arrangeSlides() {
  var n = $(".slide").length;

  var a = 4;
  var b = 4;

  var i = (1 - a) / 2;
  var j = (1 - b) / 2;

  $(".slide").each(function() {
    $(this).get()[0].setAttribute("data-y",  900 * i);
    $(this).get()[0].setAttribute("data-x", 1500 * j);
    j++;
    if (j > (b - 1) / 2) {
      i++;
      j = (1 - b) / 2;
    }
  });

  return;
  var r = 144 * n + (n < 8) * (8 - n) * 72;
  var i = 0;
  $(".slide").each(function() {
    $(this).get()[0].setAttribute("data-rotate", 360 / n * i);
    $(this).get()[0].setAttribute("data-y", Math.sin(2 * Math.PI / n * i) * r);
    $(this).get()[0].setAttribute("data-x", Math.cos(2 * Math.PI / n * i) * r);
    i++;
  });
}

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
      $(this).addClass("have-common").append($(".add-to-every-page").html());
      $(this).find(".page-number").append("<div class='page-number-container'>" + page_number + "</div>");
      $(this).find(".page-number-large").html(page_number);
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
