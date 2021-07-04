const colCache = require('../../../utils/col-cache');
const BaseXform = require('../base-xform');
const FilterColumnXform = require('../table/filter-column-xform');

class AutoFilterXform extends BaseXform {
  get tag() {
    return 'autoFilter';
  }

  constructor() {
    super();

    this.map = {
      filterColumn: new FilterColumnXform(),
    };
  }

  prepare(model) {
    (model.columns || []).forEach((column, index) => {
      this.map.filterColumn.prepare(column, {index});
    });
  }

  render(xmlStream, model) {

    if (!model) return true;

    const getAddress = function(addr) {
      if (typeof addr === 'string') {
        return addr;
      }
      return colCache.getAddress(addr.row, addr.column).address;
    };

    const firstAddress = typeof model !== 'string' ? getAddress(model.from) : '';
    const secondAddress = typeof model !== 'string' ? getAddress(model.to) : '';

    xmlStream.openNode(this.tag, {ref: typeof model === 'string' ? model : `${firstAddress}:${secondAddress}` });

    (model.columns || []).forEach(column => {
      this.map.filterColumn.render(xmlStream, column);
    });

    xmlStream.closeNode();
    return true;
  }

  parseText(text) {
    if (this.parser) {
      this.parser.parseText(text);
    }
  }

  parseOpen(node) {
    if (this.parser) {
      this.parser.parseOpen(node);
      return true;
    }
    switch (node.name) {
      case this.tag:
        this.model = {
          autoFilterRef: node.attributes.ref,
          columns: [],
        };
        return true;

      default:
        this.parser = this.map[node.name];
        if (this.parser) {
          this.parseOpen(node);
          return true;
        }
        throw new Error(`Unexpected xml node in parseOpen: ${JSON.stringify(node)}`);
    }
  }

  parseClose(name) {
    if (this.parser) {
      if (!this.parser.parseClose(name)) {
        (this.model.columns || []).push(this.parser.model);
        this.parser = undefined;
      }
      return true;
    }
    switch (name) {
      case this.tag:
        return false;
      default:
        throw new Error(`Unexpected xml node in parseClose: ${name}`);
    }
  }
}

module.exports = AutoFilterXform;
