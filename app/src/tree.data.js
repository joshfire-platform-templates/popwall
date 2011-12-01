Joshfire.define(['joshfire/class', 'joshfire/tree.data', 'joshfire/vendor/underscore'], function(Class, DataTree, _) {

  return Class(DataTree, {

    buildTree: function() {
      return [
        {
          id: 'items',

          children: function(query, callback) {
            var ds = Joshfire.factory.getDataSource("main");

            if (!ds || !ds.find){
              callback(['ERROR'], null);
            }

            ds.find({}, function (err, data){

              var filteredItems = [];

              var filter = Joshfire.factory.config.template.options.datafilter;

              var items = _.map(data.entries, function(item, id) {
                if (!filter || (item.title.indexOf(filter)>=0 || item.text.indexOf(filter)>=0)) {
                  filteredItems.push(_.extend(item, { id: item.identifier }));
                } 
              });

              callback(null, filteredItems);

            });
          }
        }
      ];
    }
  });

});