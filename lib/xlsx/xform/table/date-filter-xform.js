const BaseXform = require('../base-xform');

class DateFilterXform extends BaseXform {
  get tag() {
    return 'dateGroupItem';
  }

  render(xmlStream, model) {

    function getTimeGrouping(m) {
      if (m.year && m.month && m.day) return 'day';
      if (m.year && m.month && !m.day) return 'month';
      if (m.year && !m.month && !m.day) return 'year';
      return null;
    }

    xmlStream.leafNode(this.tag, {
      ...(model.year ? {year: model.year} : {}),
      ...(model.month ? {month: model.month} : {}),
      ...(model.day ? {day: model.day} : {}),
      dateTimeGrouping: getTimeGrouping(model),
    });
  }

  parseOpen(node) {
    if (node.name === this.tag) {
      this.model = {
        ...(node.attributes.year ? {year: node.attributes.year} : {}),
        ...(node.attributes.month ? {month: node.attributes.month} : {}),
        ...(node.attributes.day ? {day: node.attributes.day} : {}),
        ...(node.attributes.dateTimeGrouping ? {dateTimeGrouping: node.attributes.dateTimeGrouping} : {}),
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

module.exports = DateFilterXform;
