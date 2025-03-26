/*
This file contains code to work with jquery query builder. The query builder must be
included in your code prior to using this file.
*/


const queryBuilderPlugins = {
  'bt-tooltip-errors': null,
  'sortable': null,
  'not-group': null,
  'case-rule': null,
};

const optGroups = {
  "gr_signature": {
    "en": "Inscription",
    "sv": "Signatura",
  },
  "gr_texts": "Texts",
  "other": "---",
};

// QueryBuilder plugin for case-(in)sensitive search
$.fn.queryBuilder.define('case-rule', function(options) {
  let self = this;

  // Bind events
  this.on('afterInit', function() {
    self.$el.on('click.queryBuilder', '[data-case=rule]', function () {
      let $rule = $(this).closest($.fn.queryBuilder.constructor.selectors.rule_container);
      let rule = self.getModel($rule);
      rule.ignoreCase = !rule.ignoreCase;
      console.log(`afterInit: ${rule.id}, ignoreCase: ${rule.ignoreCase}`);
      // print rule configuration
      console.log(rule);
    });

    self.model.on('update', function(e, node, field) {
      if (node instanceof $.fn.queryBuilder.constructor.Rule && field === 'ignoreCase') {
        console.log(`update: ${node.id}, ignoreCase: ${node.ignoreCase}`);
        self.updateRuleCaseIgnore(node);
      }
    });
  });

  // Init case-sensitivity property
  this.on('afterAddRule', function(e, rule) {
    rule.__.ignoreCase = false;
  });

  this.on('afterCreateRuleInput.filter', function(e, rule) {
    // Show plugin's button only for text fields
    if (!rule.filter || typeof rule.filter.input !== 'string') {
      rule.$el.find(cssSelectorPluginCaseRule).hide();
      return;
    }

    if (rule.filter.input.indexOf('text') === -1) {
      rule.$el.find(cssSelectorPluginCaseRule).hide();
    } else {
      rule.$el.find(cssSelectorPluginCaseRule).show();
    }
  });

  // Modify templates
  if (!options.disable_template) {
    this.on('getRuleTemplate.filter', function(h) {
      var $h = $($.parseHTML(h.value));
      $h.find($.fn.queryBuilder.constructor.selectors.rule_actions).prepend(
          '\n<button type="button" class="btn btn-xs btn-default" active data-case="rule">' +
          '<i class="' + options.icon_checked + '"></i> ' +
          '<span class="case-rule-text">' + self.translate('Match case') + '</span>' +
          '</button>'
      );
      h.value = $h.prop('outerHTML');
    });
  }

  // Export "case-rule" to JSON
  this.on('ruleToJson.filter', function(e, rule) {
    e.value.ignoreCase = rule.ignoreCase;
  });

  // Read "case-rule" from JSON
  this.on('jsonToRule.filter', function(e, json) {
    e.value.ignoreCase = !!json.ignoreCase;
  });

  // Export case selector to SQL
  this.on('ruleToSQL.filter', function(e, rule, value, sqlFn) {
    console.log(`ruleToSQL.filter: ${rule.id}, ignoreCase: ${rule.ignoreCase}`);
    if (rule.ignoreCase) {
      e.value = 'NOCASE ( ' + e.value + ' )';
    }
  });
}, {
  icon_checked: 'bi bi-check2-square',
  disable_template: false
});

$.fn.queryBuilder.constructor.utils.defineModelProperties($.fn.queryBuilder.constructor.Rule, ['ignoreCase']);

const cssSelectorPluginCaseRule = $.fn.queryBuilder.constructor.selectors.rule_actions + ' [data-case=rule]';

$.fn.queryBuilder.extend({
  /**
   * Performs actions when a rule's case selector changes
   * @param {Rule} rule
   * @fires module:plugins.CaseSelector.updateRuleCaseIgnore
   * @private
   */
  updateRuleCaseIgnore: function(rule) {
      console.log(`updateRuleCaseIgnore: ${rule.id}, ignoreCase: ${rule.ignoreCase}`);
      rule.$el.find(cssSelectorPluginCaseRule + "> .case-rule-text")
          .text(this.translate(rule.ignoreCase ? 'Ignore case' : 'Match case'));

      /**
       * After the rule's case selector has been modified
       * @event afterUpdateRuleCaseSelector
       * @memberof module:plugins.CaseSelector
       * @param {Rule} rule
       */
      this.trigger('afterUpdateRuleCaseSelector', rule);

      this.trigger('rulesChanged');
  }
});


export function sortGroupsByOrder(items, groupOrder) {
  const key = 'optgroup'; // The key in items to group by

  // Create priority map
  const priorityMap = {};
  groupOrder.forEach((group, index) => {
    priorityMap[group] = index;
  });
  
  // Group items by their key
  const groups = {};
  items.forEach(item => {
    const groupKey = item[key] || '';
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
  });
  
  // Sort each group alphabetically by label
  Object.keys(groups).forEach(groupKey => {
    groups[groupKey].sort((a, b) => {
      const labelA = a.label || '';
      const labelB = b.label || '';
      return labelA.localeCompare(labelB);
    });
  });
  
  // Create result array by concatenating groups in specified order
  let result = [];
  groupOrder.forEach(groupKey => {
    if (groups[groupKey]) {
      result = result.concat(groups[groupKey]);
      delete groups[groupKey];
    }
  });
  
  // Add any remaining groups not specified in groupOrder
  Object.values(groups).forEach(group => {
    result = result.concat(group);
  });
  
  return result;
}

/**
 * Gets the minimum and maximum values of a numerical field from a data source
 * 
 * @param {Map|Array} dataSource - Either a Map containing database records or an array of items
 * @param {string} fieldName - The name of the field to analyze
 * @returns {Object} Object containing min and max values, or null if field doesn't exist or has no numeric values
 */
export function getMinMaxValues(dataSource, fieldName) {
  if (!dataSource) {
    throw new Error("dataSource parameter is required");
  }
  
  if (!fieldName || typeof fieldName !== 'string') {
    throw new Error("fieldName parameter is required and must be a string");
  }
  
  let min = null;
  let max = null;
  let hasValues = false;
  
  // Function to process each item
  const processItem = (item) => {
    // Skip if item doesn't have the field or value isn't numeric
    if (!item || item[fieldName] === undefined || item[fieldName] === null) {
      return;
    }
    
    // Convert to number if it's a string
    const value = typeof item[fieldName] === 'string' ? 
      parseFloat(item[fieldName]) : item[fieldName];
      
    // Skip if not a valid number
    if (isNaN(value)) {
      return;
    }
    
    // Initialize min/max on first valid value
    if (!hasValues) {
      min = value;
      max = value;
      hasValues = true;
      return;
    }
    
    // Update min/max
    if (value < min) min = value;
    if (value > max) max = value;
  };
  
  // Handle different data source types
  if (dataSource instanceof Map) {
    // Process Map values
    for (const item of dataSource.values()) {
      processItem(item);
    }
  } else if (Array.isArray(dataSource)) {
    // Process array items
    for (const item of dataSource) {
      processItem(item);
    }
  } else {
    throw new Error("dataSource must be either a Map or an Array");
  }
  
  return hasValues ? { min, max } : null;
}

function getValuesFromAllData(term, suggest, fieldName, dbMap, isTomSelect = false) {
  // Get all unique values from dbMap for the specified fieldName
  let allValues = [];
  const uniqueTracker = new Set();
  let nextArtificialId = 20000; // Starting ID for aliases

  Array.from(dbMap.values()).forEach(item => {
    const visited = uniqueTracker.has(item[fieldName]);
    if (item[fieldName] && item[fieldName] !== '' && !visited) {
      uniqueTracker.add(item[fieldName]);
      allValues.push({
        text: item[fieldName],
        id: item[fieldName],
        score: item.id || 0
      });
      if (item.aliases) {
        const aliases = item.aliases.split('|').map(a => a.trim()).filter(a => a);
        
        // Add each alias with an artificial ID
        aliases.forEach(alias => {
          if (!uniqueTracker.has(alias)) {
            uniqueTracker.add(alias);
            allValues.push({
              text: alias,
              id: alias,
              score: nextArtificialId++,
            });
          }
        });
      }
    }
  });
  
  allValues.sort((a, b) => a.score - b.score);
  
  // Comparison without diacritics:
  if (term !== '') {
    // Normalize strings to remove diacritics
    const normalizedTerm = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    allValues = allValues.filter(item => {
      const normalizedText = item.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      return normalizedText.includes(normalizedTerm);
    });
  }
  
  if (isTomSelect) {
    suggest(allValues);
    return allValues;
  }

  const values = allValues.map(item => item.text);
  suggest(values);
  return values;
}


/**
 * Creates an autocomplete configuration object for QueryBuilder.
 * 
 * @param {string} ruleId - The unique identifier for the rule.
 * @param {Map} dbMap - A Map containing the database values for autocomplete.
 * @param {Function} humanNameGetter - Function that returns a human-readable name for the given rule ID.
 * @param {Object} [opt={}] - Optional configuration parameters.
 * @param {string} [opt.fieldId] - The field ID to use (defaults to ruleId if not provided).
 * @param {string[]} [opt.operators] - Array of operators to use with this field.
 * @param {string} [opt.type='string'] - The data type for the field.
 * @param {number} [opt.size=100] - The display size of the field.
 * @param {string} [opt.optgroup='other'] - The option group to which this field belongs.
 * @returns {Object} Configuration object for QueryBuilder autocomplete field.
 * @throws {Error} If required parameters are missing or invalid.
 */
function prepareAutoComplete(ruleId, dbMap, humanNameGetter, opt = {}) {
  // Check required arguments
  if (ruleId === undefined) {
    throw new Error("prepareAutoComplete: 'ruleId' parameter is required");
  }
  if (!dbMap || !(dbMap instanceof Map)) {
    throw new Error("prepareAutoComplete: 'dbMap' parameter is required and must be a Map");
  }
  if (!humanNameGetter || typeof humanNameGetter !== 'function') {
    throw new Error("prepareAutoComplete: 'humanNameGetter' parameter is required and must be a function");
  }
  
  const fieldId = opt.fieldId || ruleId;
  const operators = opt.operators || ["my_contains", "my_not_contains",
        'my_equal', 'my_not_equal', 'my_begins_with',
        "my_not_begins_with", "my_ends_with",
        "my_not_ends_with", "is_empty", 'is_not_empty'];
  const type = opt.type || 'string';
  const size = opt.size || 100;
  const optgroup = opt.optgroup || "other";

  return {
    id: ruleId,
    field: fieldId,
    optgroup: optgroup,
    label: humanNameGetter(ruleId),
    type: type,
    plugin: 'autoComplete',
    plugin_config: {
      minChars: 0,
      delay: 100,
      source: function (term, suggest) {
        getValuesFromAllData(term, suggest, fieldId, dbMap);
      },
      menuClass: ' clusterize-content ',
      attachToParent: true,
    },
    size: size,
    // operators: operators,
  }
}

/**
 * Creates a jQuery QueryBuilder filter configuration for integer rules
 * 
 * @param {string} ruleId - ID for the rule/filter
 * @param {Map} dbMap - A Map containing the database values for autocomplete.
 * @param {Function} humanNameGetter - Function that returns a human-readable name for the given rule ID.
 * @param {Object} opt - Optional configuration parameters
 * @param {string} opt.fieldId - Field name in data (defaults to ruleId if not provided)
 * @param {Array} opt.operators - Array of operators to use for this filter
 * @param {number} opt.size - Size attribute for the input field
 * @param {string} opt.optgroup - Group to which this filter belongs
 * @param {number} opt.min - Minimum allowed value (optional)
 * @param {number} opt.max - Maximum allowed value (optional)
 * @param {number} opt.step - Step value for input (optional)
 * @param {number} opt.default_value - Default value for the field (optional)
 * @returns {Object} Filter configuration object for QueryBuilder
 */
function prepareIntegerRule(ruleId, dbMap, humanNameGetter, opt) {
  // Check required arguments
  if (ruleId === undefined) {
    throw new Error("prepareIntegerRule: 'ruleId' parameter is required");
  }
  if (!dbMap || !(dbMap instanceof Map)) {
    throw new Error("prepareIntegerRule: 'dbMap' parameter is required and must be a Map");
  }
  if (!humanNameGetter || typeof humanNameGetter !== 'function') {
    throw new Error("prepareIntegerRule: 'humanNameGetter' parameter is required and must be a function");
  }
  if (!opt) opt = {};
  const fieldId = opt.fieldId || ruleId;
  const operators = opt.operators || ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between', 'not_between'];
  const size = opt.size || 10;
  const optgroup = opt.optgroup || "other";
  
  let config = {
    id: ruleId,
    field: fieldId,
    optgroup: optgroup,
    label: humanNameGetter(fieldId),
    type: 'integer',
    size: size,
    operators: operators,
    input: 'number'
  };
  const dataLimitValues = getMinMaxValues(dbMap, fieldId);
  opt.min = opt.min || (dataLimitValues && dataLimitValues.min);
  opt.max = opt.max || (dataLimitValues && dataLimitValues.max);

  // Add validation if any constraints are specified
  if (opt.min !== undefined || opt.max !== undefined || opt.step !== undefined) {
    config.validation = {
      allow_empty_value: true
    };
    
    if (opt.min !== undefined) config.validation.min = opt.min;
    if (opt.max !== undefined) config.validation.max = opt.max;
    if (opt.step !== undefined) config.validation.step = opt.step;
  }
  
  // Add default value if provided
  if (opt.default_value !== undefined) {
    config.default_value = opt.default_value;
  }
  
  return config;
}


/**
 * Adjusts the input element in a query rule by applying either TomSelect or AutoComplete plugin
 * based on the rule's operator type.
 * 
 * @param {Object} rule - The query rule object containing the element and operator information
 * @param {Object} [tomSelectConfig={}] - Configuration options for TomSelect plugin
 * @param {Object} [autoCompleteConfig={}] - Configuration options for AutoComplete plugin
 * 
 * @description This function first cleans up any existing TomSelect or AutoComplete plugins
 * attached to the input element, then initializes the appropriate plugin based on the
 * operator type. If the operator is 'in' or 'not_in', TomSelect is applied; otherwise,
 * AutoComplete is used.
 */
function adjustTomSelectAndAutoComplete(rule, tomSelectConfig = {}, autoCompleteConfig = {}) {
  var $input = rule.$el.find('.rule-value-container input');
  const operator = rule.operator.type;    

  // Clean up existing plugins
  if ($input.data('tomSelect') !== undefined) {
    $input.tomSelect('destroy');
  }
  if ($input.hasClass('autocomplete')) {
    $input.autoComplete('destroy');
  }
  
  // Initialize the appropriate plugin based on operator
  if (operator === 'in' || operator === 'not_in') {
    $input.tomSelect(tomSelectConfig);
  } else {
    $input.autoComplete(autoCompleteConfig);
  }
}

/**
 * Creates a rule for word search in runic texts
 * 
 * @param {Object} config Configuration object
 * @param {string} config.id Rule ID
 * @param {string} config.field Field name in data
 * @param {string} config.label Human-readable label
 * @param {string} config.optgroup Option group
 * @param {string[]} config.operators Array of supported operators
 * @returns {Object} Configured QueryBuilder rule
 */
function createWordSearchRule(config) {
  const input1Label = "Normalization";
  const input2Label = "Transliteration";
  return {
    id: config.id,
    field: config.field,
    label: config.label,
    type: 'string',
    optgroup: config.optgroup || 'gr_texts',
    data: {
      multiField: true,
    },
    input: function(rule, name) {
      return `
        <div class="form-group">
          <div class="input-group mb-3 pt-2">
            <span class="input-group-text" id="${name}_normalization_input_span">${input1Label}</span>
            <input type="text" id="${name}_normalizationInput" class="form-control" placeholder="" aria-label="${input1Label}" aria-describedby="${name}_normalization_input_span">
          </div>
          <div class="input-group">
            <span class="input-group-text" id="${name}_transliteration_input_span">${input2Label}</span>
            <input type="text" id="${name}_transliterationInput" class="form-control" placeholder="" aria-label="${input2Label}" aria-describedby="${name}_transliteration_input_span">
          </div>
          <div class="mt-2">
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="${name}_personalNamesMode" value="includeAll" id="${name}_includeAddInput" checked>
              <label class="form-check-label" for="${name}_includeAddInput">Include personal names</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="${name}_personalNamesMode" value="excludeNames" id="${name}_excludeNamesInput">
              <label class="form-check-label" for="${name}_excludeNamesInput">Exclude personal names</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="${name}_personalNamesMode" value="namesOnly" id="${name}_namesOnlyInput">
              <label class="form-check-label" for="${name}_namesOnlyInput">Personal names only</label>
            </div>
          </div>
        </div>        
      `;
    },
    operators: config.operators || ['contains', 'equal', 'begins_with', 'ends_with'],
    valueGetter: function(rule) {
      var $container = rule.$el.find('.rule-value-container');
      return {
        input1: $container.find('[id$=_normalizationInput]').val(),
        input2: $container.find('[id$=_transliterationInput]').val(),
        names_mode: $container.find('[name$=_personalNamesMode]:checked').val()
      };
    },
    valueSetter: function(rule, value) {
      const names_mode = value.names_mode || 'includeAll';
      var $container = rule.$el.find('.rule-value-container');
      $container.find('[id$=_normalizationInput]').val(value.input1 || '');
      $container.find('[id$=_transliterationInput]').val(value.input2 || '');
      $container.find('[name$=_personalNamesMode][value="' + names_mode + '"]').prop('checked', true);
    }
  };
}

/*export const rundataOperators = [
  { type: 'texts_contains', nb_inputs: 2, multiple: false, apply_to: ['string'] },
  { type: 'texts_equal', nb_inputs: 2, multiple: false, apply_to: ['string'] },
  { type: 'texts_begins_with', nb_inputs: 2, multiple: false, apply_to: ['string'] },
  { type: 'texts_ends_with', nb_inputs: 2, multiple: false, apply_to: ['string'] },
];*/

export function initQueryBuilder(containerId, viewModel, getHumanName) {
  const dbMap = viewModel.getAllInscriptions();
  const queryBuilder = $(`#${containerId}`);

  const qbOperators = $.fn.queryBuilder.constructor.DEFAULTS.operators.concat([
    // Add to default operators
    { type: 'in_separated_list', nb_inputs: 1, multiple: false, apply_to: ['string'] },
    { type: 'cross_form', nb_inputs: 1, multiple: false, apply_to: ['string'] },
  ]);
  const qbLang = {
    operators: {
      'in_separated_list': "is in |-separated list",
      'cross_form': " ",
    }
  };
  const qbSqlOperators = {
    'in_separated_list': { 'op': 'IN', mod: '{0}' },
    'cross_form': { 'op': 'IN' },
  };

  const signature_text_autocomplete_cfg = {
    minChars: 0,
    delay: 100,
    source: function(term, suggest) {
      getValuesFromAllData(term, suggest, 'signature_text', dbMap);
    },
    menuClass: 'clusterize-content',
    attachToParent: true,
  };
  
  const signature_text_tomselect_cfg = {
    plugins: ['remove_button'],
    // options: getValuesFromAllData('', undefined, 'signature_text', dbMap),
    load: function(query, callback) {
      let self = this;
      getValuesFromAllData(query, callback, 'signature_text', dbMap, true);
      // prevent further loading
      self.settings.load = null;
    },
    // invoke data loading at once
    preload: true,
    valueField: 'id',
    hideSelected: true,
    delimiter: '|',
  };  
  
  let queryBuilderFilters = [
    {
      id: 'signature_text',
      optgroup: 'gr_signature',
      field: 'signature_text',
      label: getHumanName('signature_text'),
      type: 'string',
      multiple: true,
      operators: [
        'in', 'in_separated_list', 'begins_with', 'not_begins_with',
        'ends_with', 'not_ends_with', 'contains', 'not_contains',
      ],
      valueSetter: function (rule, value) {
        const $input = rule.$el.find('.rule-value-container input');
        const operator = rule.operator.type;
        if (operator === 'in' || operator === 'not_in') {
          $input.tomSelect('setValue', value);
        } else {
          if ($input[0].autoComplete) {
            $input[0].autoComplete.setValue(value);
          } else {
            $input.val(value);
          }
        }
      },
      plugin: 'tomSelect',
      plugin_config: signature_text_tomselect_cfg,
    },
    prepareAutoComplete('carver', dbMap, getHumanName),
    {
      id: 'signature_country',
      optgroup: "gr_signature",
      field: 'signature_text',
      label: 'Country or Swedish province',
      type: 'string',
      input: 'select',
      multiple: true,
      operators: ['in'],
      plugin: 'tomSelect',
      plugin_config: {
        plugins: ['remove_button'],
        options: [
          {text: 'Sweden, whole', value: 'all_sweden'},
          {text: 'Öland (Öl)', value: 'Öl '}, {text: 'Östergötland (Ög)', value: 'Ög '}, {text: 'Södermanland (Sö)', value: 'Sö '},
          {text: 'Småland (Sm)', value: 'Sm '}, {text: 'Västergötland (Vg)', value: 'Vg '}, {text: 'Uppand (U)', value: 'U '},
          {text: 'Västmanland (Vs)', value: 'Vs '}, {text: 'Närke (Nä)', value: 'Nä '}, {text: 'Värmland (Vr)', value: 'Vr '},
          {text: 'Gästrikland (Gs)', value: 'Gs '}, {text: 'Hälsingland (Hs)', value: 'Hs '}, {text: 'Medelpad (M)', value: 'M '},
          {text: 'Ångermanland (Ån)', value: 'Ån '}, {text: 'Dalarna (D)', value: 'D '}, {text: 'Härjedalen (Hr)', value: 'Hr '},
          {text: 'Jämtland (J)', value: 'J '}, {text: 'Lappland (Lp)', value: 'Lp '}, {text: 'Dalsland (Ds)', value: 'Ds '},
          {text: 'Bohuslän (Bo)', value: 'Bo '}, {text: 'Gotland (G)', value: 'G '}, {text: 'Sweden, other (SE)', value: 'SE '},
          {text: 'Denmark (DR)', value: 'DR '}, {text: 'Norway (N)', value: 'N '}, {text: 'Faroe Islands (FR)', value: 'FR '},
          {text: 'Greenland (GR)', value: 'GR '}, {text: 'Iceland (IS)', value: 'IS '}, {text: 'Finland (FI)', value: 'FI '},
          {text: 'Shetland (Sh)', value: 'Sh '}, {text: 'Orkney (Or)', value: 'Or '}, {text: 'Scotland (Sc)', value: 'Sc '},
          {text: 'England (E)', value: 'E '}, {text: 'Isle of Man (IM)', value: 'IM '}, {text: 'Ireland (IR)', value: 'IR '},
          {text: 'France (F)', value: 'F '}, {text: 'Netherlands (NL)', value: 'NL '}, {text: 'Germany (DE)', value: 'DE '},
          {text: 'Poland (PL)', value: 'PL '}, {text: 'Latvia (LV)', value: 'LV '}, {text: 'Russia (RU)', value: 'RU '},
          {text: 'Ukraine (UA)', value: 'UA '}, {text: 'Byzantium (By)', value: 'By '}, {text: 'Italy (IT)', value: 'IT '},
          {text: 'Other areas (X)', value: 'X '}
        ],
        hideSelected: true,
      },
    },
    createWordSearchRule({
      id: 'normalization_norse_to_transliteration',
      field: 'normalization_norse',
      label: 'Normalization Norse to Transliteration',
      optgroup: 'gr_texts',
    }),
    createWordSearchRule({
      id: 'normalization_scandinavian_to_transliteration',
      field: 'normalisation_scandinavian',
      label: 'Normalization Scandinavian to Transliteration',
      optgroup: 'gr_texts',
    }),
    prepareAutoComplete('english_translation', dbMap, getHumanName, { optgroup: 'gr_texts' }),
    prepareAutoComplete('swedish_translation', dbMap, getHumanName, { optgroup: 'gr_texts' }),

    prepareAutoComplete('found_location', dbMap, getHumanName),
    prepareAutoComplete('parish', dbMap, getHumanName),
    prepareAutoComplete('district', dbMap, getHumanName),
    prepareAutoComplete('municipality', dbMap, getHumanName),
    prepareAutoComplete('current_location', dbMap, getHumanName),
    prepareAutoComplete('original_site', dbMap, getHumanName),
    prepareAutoComplete('parish_code', dbMap, getHumanName),
    prepareAutoComplete('rune_type', dbMap, getHumanName),
    prepareAutoComplete('dating', dbMap, getHumanName),
    prepareIntegerRule('year_from', dbMap, getHumanName, { operators: ['equal', 'less', 'greater', 'between'] }),
    prepareIntegerRule('year_to', dbMap, getHumanName, { operators: ['equal', 'less', 'greater', 'between'] }),
    prepareAutoComplete('style', dbMap, getHumanName),
    prepareAutoComplete('material', dbMap, getHumanName),
    prepareAutoComplete('material_type', dbMap, getHumanName),
    prepareAutoComplete('objectInfo', dbMap, getHumanName),
    prepareAutoComplete('reference', dbMap, getHumanName),
    prepareAutoComplete('additional', dbMap, getHumanName),
    prepareIntegerRule('num_crosses', dbMap, getHumanName, { operators: ['equal', 'less', 'greater', 'between'] }),
    {
      id: 'cross_form',
      field: 'crosses',
      label: getHumanName('cross_form'),
      operators: ['cross_form'],
      optgroup: 'other',
      input: function (rule, name) {
        // this is a bit of a hack as getValuesFromAllData function is intended for other use
        const allCrossForms = viewModel.getAllCrossForms().map(item => {
          return `<option value="${item}">${item}</option>`;
        }).join('');
        return `
          <select name="${name}_1" class="form-select" aria-label="Cross form">${allCrossForms}</select>
          <div>Certain?
            <div class="form-check form-check-inline">
              <input type="radio" name="${name}_2" value="0" class="form-check-input" id="${name}_2_0">
              <label for="${name}_2_0" class="form-check-label">No</label>
            </div>

            <div class="form-check form-check-inline">
              <input type="radio" name="${name}_2" value="1" class="form-check-input" id="${name}_2_1">
              <label for="${name}_2_1" class="form-check-label">Yes</label>
            </div>

            <div class="form-check form-check-inline">
              <input type="radio" name="${name}_2" value="2" class="form-check-input" id="${name}_2_2" checked>
              <label for="${name}_2_2" class="form-check-label">Doesn't matter</label>
            </div>
          </div>`;
      },
      valueGetter: function (rule) {
        const val1 = rule.$el.find('.rule-value-container [name$=_1]').val();
        const val2 = rule.$el.find('.rule-value-container [name$=_2]:checked').val();
        return {form: val1, is_certain: val2};
      },
      valueSetter: function (rule, value) {
        $(rule.$el.find('.rule-value-container [name$=_1]')[0]).val(value.form);
        rule.$el.find(`.rule-value-container [name$=_2][value=${value.is_certain}]`).prop('checked', true);
      },
    },
  ];

  const my_rule_template = ({ rule_id, icons, settings, translate, builder }) => {
    return `
  <div id="${rule_id}" class="rule-container d-flex align-items-center w-100">
    <div class="rule-header">
    </div>
    ${settings.display_errors ? `
      <div class="error-container flex-shrink-0"><i class="${icons.error}"></i></div>
    ` : ''}
    <div class="rule-filter-container flex-shrink-0"></div>
    <div class="rule-operator-container flex-shrink-0"></div>
    <div class="rule-value-container flex-grow-1 me-2"></div>
    <div class="rule-footer d-flex align-items-center ms-auto">
      <div class="btn-group flex-shrink-0 rule-actions">
        <button type="button" class="btn btn-sm btn-danger" data-delete="rule">
          <i class="${icons.remove_rule}"></i> ${translate("delete_rule")}
        </button>
      </div>
    </div>
  </div>`;
  };

  // sort groups
  queryBuilderFilters = sortGroupsByOrder(queryBuilderFilters, Object.keys(optGroups));

  // swap two first filters, so that signature is on the first place!
  const tmp = queryBuilderFilters[0];
  queryBuilderFilters[0] = queryBuilderFilters[1];
  queryBuilderFilters[1] = tmp;  

  queryBuilder.queryBuilder({
    display_empty_filter: false,
    //operators: $.fn.queryBuilder.constructor.DEFAULTS.operators.concat(rundataOperators),

    plugins: queryBuilderPlugins,
    filters: queryBuilderFilters,
    sort_filters: false,
    allow_empty: false,
    optgroups: optGroups,

    operators: qbOperators,
    lang: qbLang,
    sqlOperators: qbSqlOperators,    

    templates: {
      rule: my_rule_template,
    },
  });

  // Event handler when rule is created and rule operator is changed
  $('#builder').on('afterCreateRuleInput.queryBuilder afterUpdateRuleOperator.queryBuilder', function(e, rule) {
    if (rule.filter.id !== 'signature_text') {
      return;
    }
    adjustTomSelectAndAutoComplete(rule, signature_text_tomselect_cfg, signature_text_autocomplete_cfg);
  });
 
}