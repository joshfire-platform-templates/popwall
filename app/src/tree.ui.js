Joshfire.define(['joshfire/class', 'joshfire/tree.ui', 'joshfire/uielements/list'], function(Class, UITree, List) {

  return Class(UITree, {

    buildTree: function() {
      return [
        {
          id:               'itemsList',
          type:             List,
          orientation:      'left',
          dataPath:         '/items/',
          noMouseAutoFocus: true,
          moveOnFocus:      true,
          itemInnerTemplate:
            '<div class="clearfix">'+
            '    <h1 class="title"><%= item.title %></h1>'+
            '    <img src="<%= item.image %>" />'+
            '    <div class="description"><%= item.abstract %></div>'+
            '</div>'
        }
      ];
    }

  });

});