$(function() {
  
  var itemTemplate = _.template('<li><div class="clearfix">'+
      '    <h2 class="title"><%= item.name %></h2>'+
      '    <% if (item.image || item.contentURL) { %><img src="<%= item.image.contentURL || item.contentURL %>" /><% } %>'+
      '    <div class="description"><%= item.description %></div>'+
      '</div></li>');


  var pn=0;
  var n = 50;

  var loadMore = function(query,callback) {
   
    var ds = Joshfire.factory.getDataSource("main");

    if (!ds || !ds.find){
      callback(['ERROR'], null);
    }

    ds.find(query, function (err, data){

      var filteredItems = [];

      var filter = Joshfire.factory.config.template.options.datafilter;

      var items = _.map(data.entries, function(item, id) {
        if (!filter || ((item.name||"").indexOf(filter)>=0 || (item.content||"").indexOf(filter)>=0)) {
          filteredItems.push(item);
        } 
      });

      callback(null, filteredItems);

    });
  };



  var addWP = function() {
      
    $("#loading").waypoint(function() {
      more();
    },{
      offset:'100%',
      triggerOnce:true
    });
  };
  
  
  var more = function() {
    $("#loading").show();

    loadMore({limit:n,skip:pn*n},function(err,data) {
      
      if (data.length===0) {
        $("#loading").hide();
        setTimeout(more,15*60*1000); //try again in 15 min. TODO improve heuristrics 
        return; 
      }

      var appended = $(_.map(data,function(item) {
        return itemTemplate({"item":item});
      }).join(""));

      var cnt = $("#content").append(appended);

      if (pn===0) {
        cnt.imagesLoaded(function(){
          cnt.masonry();
          addWP();
        });
      } else {
        cnt.imagesLoaded(function(){
          cnt.masonry("appended",appended);
          addWP();
        });
      }
      pn++;

    });
  };
  
  more();
  

});