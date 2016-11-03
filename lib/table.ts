import { ArrayTools } from './arraytools'

export class Column {
  header: string;
  values: any[];

  constructor(header: string) {
    this.header = header;
    this.values = [];
  }

  // add a value to a column
  push(value: any): void {
    this.values.push(value);
  }

  // get a set of the column elements
  getUniqueElements(): any[] {
    let uniqueElements = [];

    for (let element of this.values) {
      if (!ArrayTools.contains(uniqueElements, element)) {
        uniqueElements.push(element);
      }
    }

    return uniqueElements;
  }
}

export class Table {
  columns: Column[];

  constructor(...headers: string[]) {
    this.columns = [];

    for (let header of headers) {
      this.columns.push(new Column(header));
    }
  }

  // get the columns headers
  getHeaders(): string[] {
    let result = [];

    for (let c of this.columns) {
      result.push(c.header);
    }

    return result;
  }

  // get the lines of the table (except the headers)
  getLines(): any[] {
    let result = [];

    for (let index in this.columns[0].values) {
      result.push([]);

      for (let column of this.columns) {
        result[index].push(column.values[index]);
      }
    }

    return result;
  }

  // get a column by its header
  getColumn(header: string): Column {
    for (let c of this.columns) {
      if (c.header === header) {
        return c
      }
    }
  }

  // return a new table with the lines that have the passed value in the
  // column position (index)
  filter(index: number, value: any): Table {
    let headers: string[];
    headers = [];

    for (let c of this.columns) {
      headers.push(c.header);
    }

    let tableResult = new Table(...headers);

    for (let line of this.getLines()) {
      if (line[index] === value) {
        tableResult.push(line);
      }
    }

    return tableResult;
  }

  // return a new table with the lines that have the passed value in the
  // column with the passed header
  filterByHeader(header: string, value: any): Table {
    for (let i in this.columns) {
      if (this.columns[i].header === header) {
        return this.filter(Number(i), value);
      }
    }
  }

  // return a new table without the column with the passed header
  removeColumn(header: string): Table {
    let headers: string[];
    headers = [];

    for (let c of this.columns) {
      if (c.header !== header) {
        headers.push(c.header);
      }
    }

    let lines = [];
    for (let index in this.columns[0].values) {
      lines.push([]);
      for (let column of this.columns) {
        if (column.header !== header) {
          lines[index].push(column.values[index]);
        }
      }
    }

    let tableResult = new Table(...headers);

    for (let line of lines) {
      tableResult.push(line);
    }

    return tableResult;
  }

  // add a line
  push(line: any[]): void {
    for (let index in line) {
      this.columns[index].push(line[index]);
    }
  }
}
