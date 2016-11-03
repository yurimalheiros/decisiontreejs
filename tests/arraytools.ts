import {expect, assert} from 'chai';
import {ArrayTools} from '../lib/arraytools'

describe('ArrayTools', () => {
  describe('fill', () => {
    it('should create an array with the same element repeated N times', () => {
      expect(ArrayTools.fill(1, 5)).to.deep.equal([1,1,1,1,1]);
      expect(ArrayTools.fill('a', 3)).to.deep.equal(['a','a','a']);
      expect(ArrayTools.fill(1, 0)).to.deep.equal([]);
    });
  });

  describe('contains', () => {
    it('should return true if the array contains the element', () => {
      expect(ArrayTools.contains([1,2,3], 1)).to.be.true;
      expect(ArrayTools.contains([1,2,3], 2)).to.be.true;
      expect(ArrayTools.contains([1,2,3], 3)).to.be.true;
    });

    it('should return false if the array does not contain the element', () => {
      expect(ArrayTools.contains([1,2,3], 4)).to.be.false;
      expect(ArrayTools.contains([1,2,3], 'x')).to.be.false;
    });
  });

  describe('remove', () => {
    it('should remove an element from an array', () => {
      let array1 = [1,2,3];
      let array2 = [1,2];
      let array3 = [1];

      ArrayTools.remove(array1, 1);
      ArrayTools.remove(array2, 2);
      ArrayTools.remove(array3, 1);

      expect(array1).to.deep.equal([2,3]);
      expect(array2).to.deep.equal([1]);
      expect(array3).to.deep.equal([]);
    });

    it('should return the same array if the array does not contain the element', () => {
      let array1 = [1,2,3];
      let array2 = [1,2];
      let array3 = [1];

      ArrayTools.remove(array1, 4);
      ArrayTools.remove(array2, 3);
      ArrayTools.remove(array3, 2);

      expect(array1).to.deep.equal([1,2,3]);
      expect(array2).to.deep.equal([1,2]);
      expect(array3).to.deep.equal([1]);
    });
  });

  describe('mostCommon', () => {
    it('should return the most common element of an array', () => {
      assert.equal(ArrayTools.mostCommon([1, 2, 3, 1]), 1);
    });
  });
});
