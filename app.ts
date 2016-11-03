import { Table, Column } from './table'
import { DecisionTree } from './decisiontree'
import { Draw } from './draw'

// initial table
let table = new Table('Outlook', 'Temperature', 'Humidity', 'Wind', 'Play');
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

// learn
let decisionTree = new DecisionTree(table);
let root = decisionTree.learn();

// draw
let draw = new Draw(root);
draw.draw();

// events
let buttonGenerate = document.getElementById('generate');
let tableData: HTMLTableElement = <HTMLTableElement>document.getElementById('table');

buttonGenerate.onclick = function (event) {
  event.preventDefault();

  let table = new Table('Outlook', 'Temperature', 'Humidity', 'Wind', 'Play');

  let rows = tableData.rows

  for (let i = 1; i < rows.length; i++) {
    let cells = rows[i].cells;

    let values = [];
    for (let j = 0; j < cells.length; j++) {
      let select = <HTMLSelectElement>cells[j].children[0];
      values.push(select.value);
    }

    table.push(values);
  }

  // learn
  let decisionTree = new DecisionTree(table);
  let root = decisionTree.learn();

  // draw
  let draw = new Draw(root);
  draw.draw();
};