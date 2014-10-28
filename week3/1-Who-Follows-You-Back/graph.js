'use strict';

var following = require('./example-data/following.json');

//  BFS Pseudo code to implement here over json

// 1  procedure BFS(G,v):
// 2      create a queue Q
// 3      enqueue v onto Q
// 4      mark v
// 5      while Q is not empty:
// 6          t ← Q.dequeue()
// 7          if t is what we are looking for:
// 8              return t
// 9          for all edges e in G.adjacentEdges(t) do
// 12             o ← G.adjacentVertex(t,e)
// 13             if o is not marked:
// 14                  mark o
// 15                 enqueue o onto Q
// 16     return null

// +Look at this: http://stackoverflow.com/questions/16244748/breadth-first-search-in-javascript

function DirectedGraph() {
    // TODO:
    // There should be the following public methods for the Graph:

    function getNeighboursFor(node){
    	// returns a list of nodes (strings) for the given node
    }

    function pathBetween(nodeA, nodeB){
    	// returns true if there is a path between nodeA and nodeB.
    }
	
    function graphToString(){
    	// returns a string representation of the grap. 
    	// This can be the stringified version of the internal structure of the graph.
    	// Don't draw circles and -->*/
    }

    return{
    	getNeighboursFor: getNeighboursFor,
    	pathBetween: pathBetween
    	// toString: graphToString
    }
}

module.exports = DirectedGraph;