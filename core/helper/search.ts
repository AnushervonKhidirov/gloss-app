export function isContain(searchIn: string | number, searchValue: string) {
  if (typeof searchIn === 'number') searchIn = searchIn.toString();
  return searchIn.trim().toLowerCase().includes(searchValue.trim().toLowerCase());
}

export function search(item: unknown, searchValue: string) {
  if (!item) return false;
  if (typeof item === 'string' || typeof item === 'number') return isContain(item, searchValue);

  if (Array.isArray(item)) {
    for (const value of item) {
      const found = search(value, searchValue);
      if (found) return true;
    }
  }

  if (typeof item === 'object') {
    const obj = item as { [key: string]: unknown };

    for (const key in obj) {
      const found = search(obj[key], searchValue);
      if (found) return true;
    }
  }

  return false;
}
