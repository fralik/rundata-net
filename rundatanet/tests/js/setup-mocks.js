// Set up global jQuery mock
global.$ = global.jQuery = function() {
  return {
    on: () => {},
    queryBuilder: () => {},
    closest: () => {},
    find: () => ({ 
      hide: () => {}, 
      show: () => {}, 
      tomSelect: () => {}, 
      autoComplete: () => {},
      data: () => {},
      hasClass: () => false,
      val: () => {}
    }),
    prop: () => {},
    prepend: () => {},
    val: () => {},
    data: () => {},
    hasClass: () => false,
  };
};

// Add jQuery static methods/properties
$.fn = {
  queryBuilder: {
    define: () => {},
    extend: () => {},
    constructor: {
      DEFAULTS: { operators: [] },
      selectors: {
        rule_container: '.rule-container',
        rule_actions: '.rule-actions'
      },
      Rule: function() {},
      utils: {
        groupSort: (items) => items,
        defineModelProperties: () => {}
      }
    }
  },
  parseHTML: () => ([])
};

// Static methods
$.fn.on = () => {};
$.fn.queryBuilder.define = () => {};
$.fn.queryBuilder.extend = () => {};

// Export a mock for QueryBuilder
export const queryBuilderMock = {
  on: () => {},
  find: () => ({ tomSelect: () => {}, autoComplete: () => {} }),
  trigger: () => {},
  updateRuleCaseIgnore: () => {},
};