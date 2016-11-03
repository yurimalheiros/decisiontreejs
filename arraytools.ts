export class ArrayTools {

  // create an array with element repeated length times 
  static fill(element: any, length: number): any[] {
    let result = [];

    for (let i = 0; i < length; i++) {
      result.push(element);
    }

    return result;
  }

  // check if an array contains an element
  static contains(array: any[], element: any): boolean {
    return (array.indexOf(element) != -1);
  }

  // remove an element from an array
  static remove(array: any[], element: any): any[] {
    let index = array.indexOf(element);

    if (index !== -1)
      array.splice(index, 1);

    return array;
  }

  // return the most common element of an array
  static mostCommon(array: any[]) {
    if (array.length == 0) {
      return null;
    }
      
    let modeMap = {};
    let maxEl = array[0]
    let maxCount = 1;

    for (let el of array) {
      if (modeMap[el] == null)
        modeMap[el] = 1;
      else {
        modeMap[el]++;
      }
      
      if (modeMap[el] > maxCount) {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    
    return maxEl;
  }
}
