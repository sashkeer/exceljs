const BaseXform = require('../base-xform');

class CustomFilterXform extends BaseXform {
  get tag() {
    return 'customFilter';
  }

  render(xmlStream, model) {
    xmlStream.leafNode(this.tag, {
      val: model.val,
      ...(model.year ? {year: model.year} : {}),
      ...(model.month ? {month: model.month} : {}),
      operator: model.operator,
    });
  }

  parseOpen(node) {
    if (node.name === this.tag) {
      this.model = {
        ...(node.attributes.val ? {val: node.attributes.val} : {}),
        ...(node.attributes.year ? {year: node.attributes.year} : {}),
        ...(node.attributes.month ? {month: node.attributes.month} : {}),
        ...(node.attributes.day ? {day: node.attributes.day} : {}),
        operator: node.attributes.operator,
      };
      return true;
    }
    return false;
  }

  parseText() {}

  parseClose() {
    return false;
  }
}

module.exports = CustomFilterXform;
