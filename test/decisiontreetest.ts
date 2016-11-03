import { expect } from 'chai';
import { ArrayTools } from '../arraytools'
import { DecisionTree, Node } from '../decisionTree'
import { Table } from '../table'

describe('DecisionTree', () => {
  var dt: DecisionTree;
  var table: Table;

  beforeEach(function () {
    table = new Table('Outlook', 'Temperature', 'Humidity', 'Wind', 'Play');
    table.push(['sunny', 'hot', 'high', 'weak', false]);
    table.push(['sunny', 'hot', 'high', 'strong', false]);
    table.push(['overcast', 'hot', 'high', 'weak', true]);
    table.push(['rain', 'mild', 'high', 'weak', true]);
    table.push(['rain', 'cool', 'normal', 'weak', true]);
    table.push(['rain', 'cool', 'normal', 'strong', false]);
    table.push(['overcast', 'cool', 'normal', 'strong', true]);
    table.push(['sunny', 'mild', 'high', 'weak', false]);
    table.push(['sunny', 'cool', 'normal', 'weak', true]);
    table.push(['rain', 'mild', 'normal', 'weak', true]);
    table.push(['sunny', 'mild', 'normal', 'strong', true]);
    table.push(['overcast', 'mild', 'high', 'strong', true]);
    table.push(['overcast', 'hot', 'normal', 'weak', true]);
    table.push(['rain', 'mild', 'high', 'strong', false]);

    dt = new DecisionTree(table);
  });

  describe('entropy', () => {
    it('should return 1 if 50% of the elements have one label and the other 50% have other label', () => {
      let table = new Table('x', 'y');
      table.push(['a', true])
      table.push(['a', true])
      table.push(['a', false])
      table.push(['a', false])

      expect(dt.entropy(table)).to.equal(1);
    });

    it('should return 0 if all elements have the same label', () => {
      let table = new Table('x', 'y');
      table.push(['a', true])
      table.push(['a', true])
      table.push(['a', true])
      table.push(['a', true])

      expect(dt.entropy(table)).to.equal(0);
    });

    it('should return 0.8112 if the proportions are: 1/4 for positive and 3/4 for negative', () => {
      let table = new Table('x', 'y');
      table.push(['a', true])
      table.push(['a', false])
      table.push(['a', false])
      table.push(['a', false])

      expect(dt.entropy(table)).to.be.closeTo(0.8112, 0.0005);
    });
  });

  describe('informationGain', () => {
    it('should return 0.247 for attribute Outlook using the example table', () => {
      expect(dt.informationGain(table, 'Outlook')).to.be.closeTo(0.247, 0.0005);
    });

    it('should return 0.152 for attribute Humidity using the example table', () => {
      expect(dt.informationGain(table, 'Humidity')).to.be.closeTo(0.152, 0.0005);
    });

    it('should return 0.048 for attribute Wind using the example table', () => {
      expect(dt.informationGain(table, 'Wind')).to.be.closeTo(0.048, 0.0005);
    });

    it('should return 0.029 for attribute Temperature using the example table', () => {
      expect(dt.informationGain(table, 'Temperature')).to.be.closeTo(0.029, 0.0005);
    });
  });

  describe('chooseBestAttribute', () => {
    it('should return Outlook using the example table', () => {
      expect(dt.chooseBestAttribute(table)).to.equal('Outlook');
    });

    it('should return the first attribute if all attributes have zero entropy', () => {
      let table = new Table('x', 'y', 'z');
      table.push(['a', 'c', true])
      table.push(['a', 'c', false])
      table.push(['b', 'd', true])
      table.push(['b', 'd', false])

      expect(dt.chooseBestAttribute(table)).to.equal('x');
    });
  });

  describe('splitTable', () => {
    it('should return three tables if the example table is split by the attribute Outlook', () => {
      let tables = dt.splitTable(table, 'Outlook');
      let count = 0;

      for (let i in tables) {
        count++;
      }

      expect(count).to.equal(3);
    });

    it('should return two tables if the example table is split by the attribute Humidity', () => {
      let tables = dt.splitTable(table, 'Humidity');
      let count = 0;

      for (let i in tables) {
        count++;
      }

      expect(count).to.equal(2);
    });

    it('should return tables with only one unique value for attribute Outlook, if the example table is split by the attribute Outlook', () => {
      let tables = dt.splitTable(table, 'Outlook');
      expect(tables['sunny'].getColumn('Outlook').getUniqueElements()[0]).to.equal('sunny');
      expect(tables['overcast'].getColumn('Outlook').getUniqueElements()[0]).to.equal('overcast');
      expect(tables['rain'].getColumn('Outlook').getUniqueElements()[0]).to.equal('rain');
    });
  });

  describe('splitNode', () => {
    it('it should create three nodes by split table by the attribute Outlook', () => {
      let node = new Node('', '', table);
      dt.splitNode(node);

      expect(node.children.length).to.equal(3);
      expect(node.attribute).to.equal('Outlook');
      expect(node.children[0].attribute).to.equal('');
      expect(node.children[1].attribute).to.equal('');
      expect(node.children[2].attribute).to.equal('');
      expect(node.children[0].value).to.equal('sunny');
      expect(node.children[1].value).to.equal('overcast');
      expect(node.children[2].value).to.equal('rain');
    });

    it('it should not create children with tables with the attribute that split the parent node', () => {
      let node = new Node('', '', table);
      dt.splitNode(node); // best attribute is Outlook

      let headers = node.children[0].table.getHeaders();

      expect(ArrayTools.contains(headers, 'Outlook')).to.equal(false);
    });

    it('it should create two nodes by split a table (filtered by outlook=sunny) by the attribute Humidity', () => {
      let filteredTable = table.filterByHeader('Outlook', 'sunny').removeColumn('Outlook');
      let node = new Node('', '', filteredTable);

      dt.splitNode(node);

      expect(node.children.length).to.equal(2);
      expect(node.attribute).to.equal('Humidity');
      expect(node.children[0].attribute).to.equal('');
      expect(node.children[1].attribute).to.equal('');
      expect(node.children[0].value).to.equal('high');
      expect(node.children[1].value).to.equal('normal');
    });

    it('it should mark a split node as leaf if it has the same label for all lines', () => {
      let node = new Node('', '', table);
      dt.splitNode(node);

      expect(node.children[1].isLeaf).to.equal(true);
    });
  });

  describe('learn', () => {
    it('should create a simple tree', () => {
      let table = new Table('x', 'y');
      table.push(['a', true])
      table.push(['a', true])
      table.push(['b', false])
      table.push(['b', false])

      let dt = new DecisionTree(table);
      let root = dt.learn();

      expect(root.isLeaf).to.equal(false);
      expect(root.attribute).to.equal('x');
      expect(root.value).to.equal('');
      expect(root.children.length).to.equal(2);

      expect(root.children[0].isLeaf).to.equal(true);
      expect(root.children[0].attribute).to.equal('');
      expect(root.children[0].value).to.equal('a');
      expect(root.children[0].children.length).to.equal(0);

      expect(root.children[1].isLeaf).to.equal(true);
      expect(root.children[1].attribute).to.equal('');
      expect(root.children[1].value).to.equal('b');
      expect(root.children[1].children.length).to.equal(0);
    });

    it('should create the example table tree', () => {
      let root = dt.learn();

      expect(root.isLeaf).to.equal(false);
      expect(root.attribute).to.equal('Outlook');
      expect(root.value).to.equal('');
      expect(root.children.length).to.equal(3);

      let node0 = root.children[0];

      expect(node0.isLeaf).to.equal(false);
      expect(node0.attribute).to.equal('Humidity');
      expect(node0.value).to.equal('sunny');
      expect(node0.children.length).to.equal(2);

      let node1 = root.children[1];

      expect(node1.isLeaf).to.equal(true);
      expect(node1.attribute).to.equal('');
      expect(node1.value).to.equal('overcast');
      expect(node1.children.length).to.equal(0);

      let node2 = root.children[2];

      expect(node2.isLeaf).to.equal(false);
      expect(node2.attribute).to.equal('Wind');
      expect(node2.value).to.equal('rain');
      expect(node2.children.length).to.equal(2);
    });
  });

  describe('classify', () => {
    it('should return the classification of an entry', () => {
      dt.learn();
  
      expect(dt.classify(['sunny', 'hot', 'normal', 'weak'])).to.equal(true);
      expect(dt.classify(['sunny', 'mild', 'high', 'strong'])).to.equal(false);
      expect(dt.classify(['sunny', 'hot', 'high', 'weak'])).to.equal(false);
      expect(dt.classify(['rain', 'mild', 'high', 'weak'])).to.equal(true);
      expect(dt.classify(['overcast', 'mild', 'high', 'weak'])).to.equal(true);
    });

    it('should use majoritary voting when it is impossible to split perfectly the examples', () => {
      let table = new Table('x', 'y', 'z');
      table.push(['a', 'c', true]);
      table.push(['a', 'c', false]);
      table.push(['a', 'd', true]);
      table.push(['a', 'd', false]);
      table.push(['b', 'd', true]);
      table.push(['b', 'd', false]);

      let dt = new DecisionTree(table);
      dt.learn();

      expect(dt.classify(['a', 'd'])).to.equal(true);
    });

    it('should use majoritary voting when it is impossible to follow a branch', () => {
      let table = new Table('x', 'y', 'z');
      table.push(['a', 'c', true]);
      table.push(['a', 'c', false]);
      table.push(['b', 'd', true]);
      table.push(['b', 'd', false]);

      let dt = new DecisionTree(table);
      dt.learn();

      // there is no branch x = a, y = d in the tree
      expect(dt.classify(['a', 'd'])).to.equal(true);
    });
  });

  describe('treeToString', () => {
    it('should return the tree as a string', () => {
      dt.learn();
      let result = dt.treeToString();
      let lines = result.split('\n');
      
      expect(lines[0]).to.equal('Outlook');
      expect(lines[1]).to.equal('  sunny => Humidity');
      expect(lines[2]).to.equal('    high => (false)');
      expect(lines[3]).to.equal('    normal => (true)');
      expect(lines[4]).to.equal('  overcast => (true)');
      expect(lines[5]).to.equal('  rain => Wind');
      expect(lines[6]).to.equal('    weak => (true)');
      expect(lines[7]).to.equal('    strong => (false)');     
    });
  });
});
