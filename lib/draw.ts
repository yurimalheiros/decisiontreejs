import { Node } from './decisiontree'
import { ArrayTools } from './arraytools'
let cytoscape = require('cytoscape');

export class Draw {
  treeRoot: Node;
  canvas: HTMLCanvasElement;

  constructor(root: Node) {
    this.treeRoot = root;
  }

  draw() {
    let cyData = this.startCy();

    // root node
    cyData.elements.push({
      data: { id: '1', label: this.treeRoot.attribute }
    });

    // set other nodes
    let idCount = 1;
    let toProcess = [{
      children: this.treeRoot.children, parent: this.treeRoot,
      parentId: idCount
    }];

    while (toProcess.length > 0) {
      let item = toProcess.shift();
      let children = item.children;
      let parent = item.parent;
      let parentId = item.parentId;

      for (let child of children) {
        idCount += 1;

        if (child.isLeaf) {
          let columns = child.table.columns
          let text = ArrayTools.mostCommon(columns[columns.length - 1].values);

          cyData.elements.push({
            data: { id: String(idCount), label: String(text) }, classes: 'leaf'
          });
        } else {
          cyData.elements.push({
            data: { id: String(idCount), label: child.attribute }
          });
        }

        cyData.elements.push({
          data: {
            id: parentId + "->" + idCount, source: String(parentId),
            target: String(idCount), label: child.value
          }
        });

        toProcess.push({ children: child.children, parent: child, parentId: idCount });
      }
    }

    let cy = cytoscape(cyData);
  }

  private startCy() {
    return {
      container: document.getElementById('cy'),

      elements: [],

      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(label)',
            'shape': 'roundrectangle',
            'text-valign': "center",
            'color': '#fff',
            'width': '100px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'label': 'data(label)'
          }
        },
        {
          selector: '.leaf',
          style: {
            'width': '60px',
            'background-color': '#004cff'
          }
        }
      ],

      layout: {
        name: 'breadthfirst',
        roots: ['1']
      }
    };
  }
}