import entities from './entities';

class Builder {
  static get _tools() {
    return {
      escapes: {
        'Object': /{([\s\S]+?)}/g,
        'Array': /\[([\s\S]+?)\]/g
      }
    };
  }
  constructor() {
    this._classes = entities;
  }

  get classes() {
    return this._classes;
  }

  _getFieldInfo(field) {
    let entityName = false;
    let objectType = false;
    Object.keys(Builder._tools.escapes).some(type => {
      field.type.replace(Builder._tools.escapes[type], (match, dec) => {
        entityName = dec;
        objectType = type;
      });
    });
    return { entityName, objectType };
  }

  _buildData(field, mapKey, payload) {
    const { entityName, objectType } = this._getFieldInfo(field);
    let result = null;

    if (!entityName) { // plain object
      if (this.classes[field.type])
        result = this.parse(field.type, payload, mapKey, 1);
      else result = field.type == 'Date' ?
                      new window[field.type](payload) : window[field.type](payload);
      return result;
    }

    if (objectType === 'Array' && Array.isArray(payload)) {
      result = [];
      payload.forEach(elem => {
        result.push(this.parse(entityName, elem, mapKey, 1));
      });
    } else if (objectType === 'Object' && typeof payload === 'object') {
      result = {};
      Object.keys(payload).forEach(objKey => {
        result[objKey] = this.parse(entityName, payload[objKey], mapKey, 1);
      });
    }
    return result;
  }

  addClasses(classes) {
    this._classes = { ...this._classes, ...classes };
  }

  build(className, payload, mapKey, depth = 0) {
    if (depth > 1 || !payload)
      return;
    if (!this._classes[className]) {
      if (window[className])
        return className === 'Date' ?
                new window[className](payload) : window[className](payload);
      console.error(`Class with name ${className} does not exist`);
      return;
    }

    const instance = {};
    const fields = this._classes[className].scheme;
    Object.keys(fields).some((key) => {
      const field = fields[key];
      
      if (!field.type) {
        console.error(`Field's type ${key} not defined`);
        return true;
      }
      
      if (payload[key] === null || typeof payload[key] === 'undefined') {
        if (field.required) {
          console.error(`Required field ${key} does not present (${className})`);
          return true;
        }
        if (!field.default || typeof field.default !== 'function') {
          instance[key] = null;
        } else instance[key] = field.default.call(null);
        return false;
      }
      instance[key] = this._buildData(field, mapKey, payload[key]);
      return false;      
    });
    return instance;
  }

  parse(className, payload, mapKey, depth = 0) {
    let mapped = {};
    if (mapKey) {
      if (!this._classes[className]) {
        console.error(`Class with name ${className} does not exist`);
        return;
      }

      const fields = this._classes[className].scheme;
      Object.keys(fields).forEach(key => {
        const field = fields[key];
        if (!field.map || !field.map[mapKey]) {
          mapped[key] = payload[key];
          return;
        }
        let slice = payload;
        const seq = field.map[mapKey].split('.');
        seq.some(item => {
          if (!slice[item]) {
            if (!field.default || typeof field.default !== 'function') {
              slice = null;
            } else slice = field.default.call(null);
            return true;
          }
          slice = slice[item];
        });
        mapped[key] = slice;
      });
    } else {
      mapped = { ...payload };
    }
    return this.build(className, mapped, mapKey, depth);
  }

  getAdditional(className, fieldName, payload, mapKey) {
    if (!this._classes[className]) {
      console.error(`Class with name ${className} does not exist`);
      return;
    }
    if (!this._classes[className].scheme[fieldName]) {
      console.error(`Field with name ${fieldName} of class ${className} does not exist`);
      return;
    }
    const field = this._classes[className].scheme[fieldName];
    return this._buildData(field, mapKey, payload);
  }
}

export default Builder;