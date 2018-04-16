define(['ojs/ojcore', 'text!./view.html', './viewModel', 'text!./component.json', 'css!./styles', 'ojs/ojcomposite', 'ojs/ojbutton'],
  function(oj, view, viewModel, metadata) {
    oj.Composite.register('demo-chart-orientation-control', {
      view: {inline: view}, 
      viewModel: {inline: viewModel}, 
      metadata: {inline: JSON.parse(metadata)}
    });
  }
);