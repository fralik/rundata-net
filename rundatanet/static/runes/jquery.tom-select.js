/**
 * jquery.tom-select.js
 * jQuery wrapper for tom-select
 * 
 * Usage:
 * $('#select-box').tomSelect(options);
 * 
 * Based on the tom-select library (https://tom-select.js.org/)
 */

(function($) {
    'use strict';

    // Store instance data
    const instances = new WeakMap();

    // Define the plugin
    $.fn.tomSelect = function(options) {
        const args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            const $this = $(this);
            let instance = instances.get(this);

            // Method calling logic
            if (typeof options === 'string' && options[0] !== '_') {
                if (instance) {
                    // Call tom-select method with arguments
                    if (typeof instance[options] === 'function') {
                        const result = instance[options].apply(instance, args);
                        
                        // Special handling for methods that return a value
                        if (options === 'getValue' || options === 'getItem' || options === 'getOption') {
                            return result;
                        }
                    } else {
                        $.error('Method ' + options + ' does not exist on jQuery.tomSelect');
                    }
                }
                return;
            }

            // If an instance already exists, destroy it first
            if (instance) {
                instance.destroy();
            }

            // Create a new instance of TomSelect
            if (window.TomSelect) {
                instance = new TomSelect(this, options || {});
                instances.set(this, instance);
                
                // Store the tom-select instance on the element for backward compatibility
                $this.data('tomSelect', instance);
            } else {
                $.error('TomSelect is not defined. Make sure tom-select.js is loaded before the jQuery wrapper.');
            }
        });
    };

    // Add convenience methods similar to select2/chosen
    $.fn.tomSelect.defaults = {};

    // Plugin methods that should return the jQuery object for chaining
    [
        'addOption', 'updateOption', 'removeOption',
        'addItem', 'removeItem', 'clear', 'addOptions',
        'refreshOptions', 'refreshItems', 'focus', 'blur',
        'lock', 'unlock', 'disable', 'enable',
        'setValue', 'setMaxItems', 'setActiveItem', 'setActiveOption'
    ].forEach(function(method) {
        $.fn[method] = function() {
            const args = Array.prototype.slice.call(arguments);
            
            return this.each(function() {
                const instance = instances.get(this) || $(this).data('tomSelect');
                if (instance && typeof instance[method] === 'function') {
                    instance[method].apply(instance, args);
                }
            });
        };
    });

    // Plugin methods that should return a specific value
    ['getValue', 'getOptions', 'getItems', 'getOption'].forEach(function(method) {
        $.fn[method] = function() {
            const $el = $(this).first();
            const instance = instances.get($el[0]) || $el.data('tomSelect');
            
            if (instance && typeof instance[method] === 'function') {
                return instance[method].apply(instance, arguments);
            }
            
            return undefined;
        };
    });

})(jQuery);