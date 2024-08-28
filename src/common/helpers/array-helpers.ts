import { isEmpty } from 'lodash';

export class ArrayHelpers {
  static isArrayOfObjects<T>(data: T): boolean {
    if (isEmpty(data)) return false;
    return (
      Array.isArray(data) &&
      data.every(
        (item) =>
          typeof item === 'object' && item !== null && !Array.isArray(item),
      )
    );
  }
}
