import { ArrayTools } from './arraytools'
import { Table } from "./table"

export class Node {
  children: Node[];
  attribute: string;
  value: string;
  table: Table;
  isLeaf: boolean;

  constructor(attribute: string, value: string, table: Table) {
    this.children = [];
    this.attribute = attribute;
    this.value = value;
    this.table = table;
    this.isLeaf = false;
  }
}

export class DecisionTree {
  table: Table;
  root: Node;

  constructor(table: Table) {
    this.table = table;
  }

  // generate the decision tree
  learn(): Node {
    let rootNode = new Node('', '', this.table);
    let toProcess = [rootNode];

    while (toProcess.length > 0) {
      let node = toProcess.shift()

      if (node.table.getHeaders().length > 1) {        
        this.splitNode(node);

        for (let n of node.children) {
          if (n.isLeaf === false) {
            toProcess.push(n);
          }
        }
      } else {      
        node.isLeaf = true;
      }
    }

    this.root = rootNode;
    return rootNode;
  }

  // classify an example
  classify(entry: any[]): any {
    let node = this.root;

    // map header to attribute
    let headers = this.table.getHeaders();
    let values = {};

    for (let i = 0; i < headers.length-1; i++) {
      let header = headers[i];
      let value = entry[i];
      values[header] = value;
    }

    // go to the correct node
    while (!node.isLeaf) {
      let attribute = node.attribute;
      let children = node.children;
      let entryValue = values[attribute];
      
      let foundChild = false;
      for (let c of children) {
        if (c.value == entryValue) {
          node = c;
          foundChild = true;
        }
      }

      if (!foundChild) {
        break;
      }
    }

    // return the classification
    let columns = node.table.columns
    return ArrayTools.mostCommon(columns[columns.length-1].values);
  }

  // split a tree node using the best attribute 
  splitNode(node: Node): void {
    let bestAttribute = this.chooseBestAttribute(node.table);
    let splitTables = this.splitTable(node.table, bestAttribute);
    node.attribute = bestAttribute;

    for (let i in splitTables) {
      let table = splitTables[i];
      let newNode = new Node('', i, table.removeColumn(bestAttribute));

      let lastColumn = table.columns[table.columns.length - 1];
      let labels = lastColumn.getUniqueElements();

      if (labels.length == 1) {
        newNode.isLeaf = true;
      }

      node.children.push(newNode);
    }
  }

  // pick the best attribute to split a table
  chooseBestAttribute(table: Table): string {
    let columns = table.columns;

    let headers = [];
    for (let c of columns.slice(0, -1)) {
      headers.push(c.header);
    }

    let highestInformationGainAttribute = '';
    let highestInformationGain = 0;

    for (let h of headers) {
      let informationGain = this.informationGain(table, h);

      if (highestInformationGainAttribute === '') {
        highestInformationGain = informationGain;
        highestInformationGainAttribute = h;
      } else if (informationGain > highestInformationGain) {
        highestInformationGain = informationGain;
        highestInformationGainAttribute = h;
      }
    }

    return highestInformationGainAttribute
  }

  // calculate the entropy of a table
  entropy(table: Table): number {
    let lastColumn = table.columns[table.columns.length - 1];
    let labels = lastColumn.getUniqueElements();

    let totalLines = table.getLines().length;
    let result = 0;

    for (let label of labels) {
      let filteredTable = table.filter(table.columns.length - 1, label);
      let filteredLines = filteredTable.getLines().length;

      result += -1 * (filteredLines / totalLines) * Math.log2(filteredLines / totalLines);
    }

    return result;
  }

  // calculate the information gain of an attribute of a table 
  informationGain(table: Table, attribute: string): number {
    let tableEntropy = this.entropy(table);
    let tableLinesLength = table.getLines().length
    let column = table.getColumn(attribute);
    let uniqueElements = column.getUniqueElements();

    let result = tableEntropy;

    for (let e of uniqueElements) {
      let splitTable = table.filterByHeader(attribute, e);
      let splitTableLinesLength = splitTable.getLines().length

      result -= (splitTableLinesLength / tableLinesLength) * this.entropy(splitTable);
    }

    return result;
  }

  // split a table using an attribute
  splitTable(table: Table, attribute: string): { [valueName: string]: Table } {
    let result = {};

    let column = table.getColumn(attribute);
    let uniqueElements = column.getUniqueElements();

    for (let e of uniqueElements) {
      let splitTable = table.filterByHeader(attribute, e);
      result[e] = splitTable;
    }

    return result;
  }

  // return a tree as a string
  treeToString(node=this.root, indent=''): string {
    let result = '';
    
    if (node.value) {
      result += indent + node.value + ' => ';
    }
    
    if (node.attribute) {
      result += node.attribute + '\n';
    }
    
    if (node.isLeaf) {
      let columns = node.table.columns
      result += '(' + ArrayTools.mostCommon(columns[columns.length-1].values) + ')\n';
    }

    indent += '  ';
    for (let c of node.children) {
      result += this.treeToString(c, indent);
    }

    indent = indent.slice(0, -2);
    
    return result;
  }
}
