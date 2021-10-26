class Storage {
  static set(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
  }

  static get(name) {
    return JSON.parse(localStorage.getItem(name));
  }

  static reset() {
    localStorage.removeItem('ydToken');
  }
}

export default Storage;
