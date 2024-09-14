/**
 * Recursively converts all keys in an object or array from camelCase to snake_case.
 *
 * This utility function is designed to handle objects, arrays, and other values.
 * It maps camelCase keys to snake_case, which is commonly used in API requests.
 *
 * It processes nested objects and arrays recursively while preserving the original type structure.
 *
 * @param {T} obj - The object or array to convert.
 * @returns {T} The converted object or array with snake_case keys, maintaining the original structure.
 */
export const toSnakeCase = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    // Recursively convert each element in the array
    return obj.map(v => toSnakeCase(v)) as unknown as T;
  } else if (obj !== null && typeof obj === 'object') {
    // Convert each key in the object to snake_case and recursively process values
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      (result as Record<string, unknown>)[snakeKey] = toSnakeCase(
        (obj as Record<string, unknown>)[key]
      );
      return result;
    }, {} as T);
  }
  // Return non-object values as they are
  return obj;
};

/**
 * Recursively converts all keys in an object or array from snake_case to camelCase.
 *
 * This utility function handles arrays and objects. It converts snake_case keys
 * (e.g., "my_key") to camelCase keys (e.g., "myKey"), which is commonly used in
 * JavaScript-based applications.
 *
 * It processes nested objects and arrays recursively while preserving the original type structure.
 *
 * @param {T} data - The object or array to convert.
 * @returns {T} The converted object or array with camelCase keys, maintaining the original structure.
 */
export const toCamelCase = <T>(data: T): T => {
  if (Array.isArray(data)) {
    return data.map(item => toCamelCase(item)) as unknown as T;
  } else if (data !== null && typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (match, letter) =>
        letter.toUpperCase()
      );
      (acc as Record<string, unknown>)[camelKey] = toCamelCase(
        (data as Record<string, unknown>)[key]
      );
      return acc;
    }, {} as T);
  }
  // Return non-object values as they are
  return data;
};
