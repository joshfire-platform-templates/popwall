$(function() {
  
  var itemTemplate = _.template('<li><div class="clearfix">'+
      '    <h2 class="title"><%= item.name %></h2>'+
      '    <% if (item.image || item.contentURL) { %><img src="<%= item.image.contentURL || item.contentURL %>" /><% } %>'+
      '    <div class="description"><%= item.description %></div>'+
      '</div></li>');

  var options = Joshfire.factory.config.template.options;

  // Set UI
  (function () {

      // For local testing
      // we replace mustache values directly
      var parameters = [
        "headerhtml",
        "footerhtml"
      ];

      _.map(parameters, function (item) {
        $("#"+item).html(options[item]||"");
      });

      if (options.backgroundcolor) {
        $("body").css("background",options.backgroundcolor);
      } else if (options.backgroundimage) {
        $("body").css("background","url("+options.backgroundimage.url+")");
      } else {
        $("body").css("background","url(img/brushed_alu.png) fixed");
      }

      if (options.headertitle) {
        $("<h1></h1>").appendTo("#header").text(options.headertitle);
      } else if (options.headerlogo) {
        $("<img />").appendTo("#header").attr("src",options.headerlogo.url);
      }

  })();

  var autorefresh =  options.autorefresh;

  var pn=0;
  var n = 50;

  var loadMore = function(query,callback) {
   
    var ds = Joshfire.factory.getDataSource("main");

    if (!ds || !ds.find){
      callback(['ERROR'], null);
    }

    ds.find(query, function (err, data){

      var filteredItems, filter, items;

      if (err) {
        callback(err, null);
      }

      if (data) {

        filteredItems = [];

        filter = Joshfire.factory.config.template.options.datafilter;

        items = _.map(data.entries, function(item, id) {
          if (!filter || ((item.name||"").indexOf(filter)>=0 || (item.content||"").indexOf(filter)>=0)) {
            filteredItems.push(item);
          }
        });

        callback(null, filteredItems);
      }
    });
  };
  
  var more = function() {
    console.log("Refresh");
    loadMore({
      limit:n,
      skip:pn*n
    }, function(err,data) {

      if (autorefresh) {
        setTimeout(more, autorefresh * 1000);
      }

      if (err || data.length === 0) {
        return;
      }

      var appended = $(_.map(data,function(item) {
        return itemTemplate({"item":item});
      }).join(""));

      var cnt = $("#content").append(appended);

      if (pn===0) {
        cnt.imagesLoaded(function(){
          cnt.masonry();

          // tidoust (2012-04-26): disabled waypoint as datasources do not yet support pagination
          //addWP();
        });
      } else {
        cnt.imagesLoaded(function(){
          cnt.masonry("appended",appended);
          // tidoust (2012-04-26): disabled waypoint as datasources do not yet support pagination
          //addWP();
        });
      }
      pn++;

    });
  };
  
  more();
  

});