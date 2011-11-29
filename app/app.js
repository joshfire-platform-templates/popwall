Joshfire.define(['joshfire/app', 'joshfire/class', './src/tree.data', './src/tree.ui'], function(BaseApp, Class, Data, UI) {
  
  return Class(BaseApp, {

    id:        'popwall',
    uiClass:   UI,
    dataClass: Data,

    setup: function(callback) {
     var self = this;

     self.ui.element('/itemsList').subscribe('data', function(ev) {
       self.ui.moveTo('focus', '/itemsList');
     });

     callback(null, true);
    }

  });

});