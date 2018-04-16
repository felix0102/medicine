define(['knockout'], function (ko) {
  function model (context) {      
    var self = this;
    var icons = {'area': 'demo-coc-area-',
                 'bar': 'demo-coc-bar-',
                 'boxPlot': 'demo-coc-box-',
                 'combo': 'demo-coc-bar-',
                 'funnel': 'demo-coc-funnel-',
                 'line': 'demo-coc-line-',
                 'lineWithArea': 'demo-coc-area-'};
    var type = ko.observable();
    self.verticalIcon = ko.observable();
    self.horizontalIcon = ko.observable();

    type.subscribe(function (value) {
      var key = icons[value] ? icons[value] : icons['bar'];
      self.verticalIcon('oj-icon ' + key + 'vert');
      self.horizontalIcon('oj-icon ' + key + 'horiz');
    });

    var element = context.element;
    element.addEventListener('typeChanged', function(event) {
      type(event.detail.value);
    });

    context.props.then(function(properties) {
      type(properties['type']);
    });
  }
  return model;
})
