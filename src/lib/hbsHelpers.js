import handlebars from "handlebars";
const { SafeString } = handlebars;

export default {
  isEqual: function (arg1, arg2) {
    return arg1 === arg2 ? true : false;
  },
  typeof: (val) => typeof val,
  // Source: https://www.cloudhadoop.com/handlebarjs-if-helper/
  isAnd: function (cond1, cond2, options) {
    return cond1 && cond2 ? options.fn(this) : options.inverse(this);
  },
  isOr: function (cond1, cond2, options) {
    return cond1 || cond2 ? options.fn(this) : options.inverse(this);
  },
  ifEq: function (a, b, options) {
    return a == b ? options.fn(this) : options.inverse(this);
  },
  hasTodo: function (tasks, options) {
    if (tasks.length > 0 && tasks.filter((task) => task.done === false).length > 0) return options.fn(this);
  },
  hasDone: function (tasks, options) {
    if (tasks.length > 0 && tasks.filter((task) => task.done === true).length > 0) return options.fn(this);
  },
  ifNotHasTodo: function (tasks, options) {
    if (tasks.length === 0 || tasks.filter((task) => task.done === false).length === 0) return options.fn(this);
  },
  ifNotHasDone: function (tasks, options) {
    if (tasks.length === 0 || tasks.filter((task) => task.done === true).length === 0) return options.fn(this);
  },
};
