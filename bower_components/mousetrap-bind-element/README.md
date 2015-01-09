# Mousetrap Specific Element Bind

This extension allows you to specify keyboard events that will work on only specific DOMElements

Usage looks like:

```javascript
Mousetrap.bindElement('ctrl+s', function() {
    _save();
});
```

This means that a keyboard event bound using ``Mousetrap.bind`` will only work outside of form input fields, but using ``Moustrap.bindElement`` will work only on the specified DOMElements.

# Notes

This is a basically re-write of the [bindGlobal plugin](https://github.com/ccampbell/mousetrap/tree/master/plugins/global-bind) in Mousetrap
