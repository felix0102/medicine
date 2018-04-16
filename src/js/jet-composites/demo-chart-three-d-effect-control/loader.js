define(['ojs/ojcore', 'text!./view.html', 'text!./component.json', 'css!./styles', 'ojs/ojcomposite', 'ojs/ojbutton'],
  function(oj, view, metadata) {
    oj.Composite.register('demo-chart-three-d-effect-control', {
      view: {inline: view}, 
      metadata: {inline: JSON.parse(metadata)}
    });
  }
);