const get = (key, parser) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;
    return parser ? parser(value) : value;
  } catch (e) {
    return null;
  }
};

const set = (key, value, serializer) => {
  try {
    return localStorage.setItem(key, serializer ? serializer(value) : value);
  } catch (e) {
    return null;
  }
};

export { get, set };