//var cytoscape = require('cytoscape');
// var cytoscape = require("imports?require=>false!cytoscape");
    //window.cytoscape = cytoscape;

var maingraph = {};
var _ = require('../../lodash.min');

maingraph.create = function(el, inputNodes, inputEdges, mainfun, updatefun, isCreated){

  this.cy = cytoscape({
    container: el,
    userZoomingEnabled: false,
    style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'content': 'data(name)',
          'font-size': 14,
          'text-valign': 'center',
          'text-halign': 'center',
        })
      .selector('node[nodeType="function"]')
          .css({
            'background-color': '#fff',
            'color': '#8E3C3A',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': 30,
            'width': 40,
            'height': 40,
        })
      .selector('node[nodeType="estimate"]')
          .css({
            'width': 80,
            'font-weight': 'bold',
            'height': 25,
            'color': '#444',
            'background-color': '#fff',
            'text-outline-width': 4,
            'text-outline-color': '#fff'
        })
      .selector('node[nodeType="dependent"]')
          .css({
            'color': '#8E3C3A',
            'width': 80,
            'font-weight': 'bold',
            'height': 25,
            'background-color': '#fff',
            'text-outline-width': 4,
            'text-outline-color': '#fff'
        })
      .selector('edge')
        .css({
          'target-arrow-shape': 'triangle',
          'width': 2,
          'line-color': '#ddd',
          'target-arrow-color': '#666'
        })
      .selector('edge[toType="dependent"]')
        .css({
          'line-color': '#994343',
          'target-arrow-color': '#994343'
        })
      .selector('.highlighted')
        .css({
          'background-color': '#61bffc',
          'line-color': '#61bffc',
          'target-arrow-color': '#61bffc',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s'
        }),

    elements: {
        nodes: inputNodes,
        edges: inputEdges
      },
    layout: {
      name: 'breadthfirst',
      directed: true,
      padding: 10,
      avoidOverlap: true
    },
    ready: function(){
      //this.on('tap', function(event){
        //console.log(event)
        //console.log('tap event')
      //})
      //this.on('tapstart', function(event){
        //console.log(event)
        //console.log('tap start')
      //})
      this.on('drag', function(event){
        id = event.cyTarget.data().nodeId;
        position = event.cyTarget.renderedPosition()
        object = {id: id, renderedPosition: position}
        updatefun([object])
      })
      this.on('pan', function(event){
        var newLocations = _.map(event.cy.nodes(), function(n){return {id: n.data().nodeId, renderedPosition: n.renderedPosition()}})
        updatefun(newLocations)
      })
      this.on('cxttapend', function(event){
        data = event.cyTarget.data()
        if (data) {
          mainfun(data.nodeId)
        } else {
          mainfun(null)
        }
      });
      isCreated();
    }
  });

};
maingraph.update = function(inputNodes, inputEdges, callback){
  this.cy.load({
    nodes: inputNodes,
    edges: inputEdges
  }, callback);
}

module.exports = maingraph;