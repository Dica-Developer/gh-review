/**
 * adds a bindElement method to Mousetrap that allows you to
 * bind specific keyboard shortcuts that will only work on a specific element
 *
 * usage:
 * Mousetrap.bindElement(DOMElement, 'ctrl+s', _saveChanges);
 */
/* global Mousetrap:true */
Mousetrap = (function(Mousetrap) {
    var _elementCallbacks = {},
        _originalStopCallback = Mousetrap.stopCallback,
        boundElement;

    Mousetrap.stopCallback = function(e, element, combo, sequence) {
        if (e.target !== boundElement) {
            return true;
        }

        if (_elementCallbacks[combo] || _elementCallbacks[sequence]) {
            return false;
        }

        return _originalStopCallback(e, element, combo);
    };

    Mousetrap.bindElement = function(element, keys, callback, action) {
        boundElement = element;
        Mousetrap.bind(keys, callback, action);

        if (keys instanceof Array) {
            for (var i = 0; i < keys.length; i++) {
                _elementCallbacks[keys[i]] = true;
            }
            return;
        }

        _elementCallbacks[keys] = true;
    };

    return Mousetrap;
}) (Mousetrap);
