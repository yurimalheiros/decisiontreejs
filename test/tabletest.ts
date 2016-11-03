import { expect } from 'chai';
import { Table } from '../table'

describe('Table', () => {
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
  });

  describe('headers', () => {
    it('should return the columns headers', () => {
      let headers = table.getHeaders();
      expect(headers).to.deep.equal(['Outlook', 'Temperature', 'Humidity', 'Wind', 'Play']);
    });
  });

  describe('getLines', () => {
    it('should return all table lines, except the headers', () => {
      let lines = table.getLines();
      expect(lines.length).to.equal(14);
      expect(lines[0]).to.deep.equal(['sunny', 'hot', 'high', 'weak', false]);
      expect(lines[1]).to.deep.equal(['sunny', 'hot', 'high', 'strong', false]);
      expect(lines[2]).to.deep.equal(['overcast', 'hot', 'high', 'weak', true]);
    });
  });

  describe('getColumn', () => {
    it('should return a column by its header', () => {
      let column = table.getColumn('Outlook');
      expect(column.header).to.equal('Outlook');
      expect(column.values).to.deep.equal(['sunny', 'sunny', 'overcast', 'rain', 'rain', 'rain',
        'overcast', 'sunny', 'sunny', 'rain', 'sunny', 'overcast',
        'overcast', 'rain']);
    });
  });

  describe('filter', () => {
    it('should filter a table by a column index and value', () => {
      let newTableLines = table.filter(0, 'sunny').getLines();

      expect(newTableLines.length).to.equal(5);
      expect(newTableLines[0]).to.deep.equal(['sunny', 'hot', 'high', 'weak', false]);
      expect(newTableLines[1]).to.deep.equal(['sunny', 'hot', 'high', 'strong', false]);
      expect(newTableLines[2]).to.deep.equal(['sunny', 'mild', 'high', 'weak', false]);
      expect(newTableLines[3]).to.deep.equal(['sunny', 'cool', 'normal', 'weak', true]);
      expect(newTableLines[4]).to.deep.equal(['sunny', 'mild', 'normal', 'strong', true]);
    });
  });

  describe('filterByHeader', () => {
    it('should filter a table by a column value and header', () => {
      let newTableLines = table.filterByHeader('Outlook', 'sunny').getLines();

      expect(newTableLines.length).to.equal(5);
      expect(newTableLines[0]).to.deep.equal(['sunny', 'hot', 'high', 'weak', false]);
      expect(newTableLines[1]).to.deep.equal(['sunny', 'hot', 'high', 'strong', false]);
      expect(newTableLines[2]).to.deep.equal(['sunny', 'mild', 'high', 'weak', false]);
      expect(newTableLines[3]).to.deep.equal(['sunny', 'cool', 'normal', 'weak', true]);
      expect(newTableLines[4]).to.deep.equal(['sunny', 'mild', 'normal', 'strong', true]);
    });
  });

  describe('removeColumn', () => {
    it('should return a new table without a column', () => {
      let newTable = table.removeColumn('Outlook');

      expect(newTable.getHeaders()).to.deep.equal(['Temperature', 'Humidity', 'Wind', 'Play']);
      
      let lines = newTable.getLines();
      expect(lines[0]).to.deep.equal(['hot', 'high', 'weak', false]);
      expect(lines[1]).to.deep.equal(['hot', 'high', 'strong', false]);
      expect(lines[2]).to.deep.equal(['hot', 'high', 'weak', true]);
    });
  });

  describe('push', () => {
    it('should add a new line', () => {
      let table = new Table('x', 'y');
      
      table.push([1, 2]);
      expect(table.getLines().length).to.equal(1);

      table.push([1, 2]);
      expect(table.getLines().length).to.equal(2);
    });
  });


});
