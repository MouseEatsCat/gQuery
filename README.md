# gQuery&trade;

<p align="center">
  <img 
    alt="gQuery.js Logo"
	width="250"
    src="https://i.imgur.com/Ej4lzaG.png"/>
</p>

[![npm version](https://badge.fury.io/js/@micheldescoteaux%2Fgquery.svg)](https://badge.fury.io/js/@micheldescoteaux%2Fgquery)
![Download count all time](https://img.shields.io/npm/dt/@micheldescoteaux%2Fgquery.svg)
![npm](https://img.shields.io/npm/dm/@micheldescoteaux%2Fgquery.svg)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@micheldescoteaux%2Fgquery.svg)

Similar to jQuery but with less bulk. Also known as goutQuery&trade;

# Installation
## Option 1 - Download the file directly

Download the file
```bash
curl -LJO https://raw.githubusercontent.com/MouseEatsCat/gQuery/main/dist/gQuery.min.js
```

And then include it using
```html
<script type="module" src="path/to/gQuery.min.js"></script>
```

And then in your script:
```javascript
import gQuery from "path/to/gQuery.min.js";
```

## Option 2 - Using a bundler

```bash
npm install --save @micheldescoteaux/gquery
```

And then in your script
```javascript
import gQuery from "@micheldescoteaux/gquery";
```

# Usage
The following returns a `gQueryElementList` object
```JS
gQuery(".classname")
```
## Examples
Add a class to and element when clicked
```javascript
gQuery(".gallery-filter").on('click', function (e) {
	this.addClass('clicked');
});
```

You can also provide an element as the second parameter to use it as the context
```javascript
const parent = gQuery('#parent');

gQuery(".child-of-parent", parent).each(function (element) {
  // element is a descendant of the parent element
  // and has class: "child-of-parent"
});
```

# Reference
## gQueryElementList
The `gQueryElementList` object has the following methods available:

| Method          | Parameters                                                                  | Description                                                          |
| --------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `on()`          | event: string<br>query: EventCallback \| string<br>callback?: EventCallback | Add an event handler to all queried elements                         |
| `trigger()`     | event: string                                                               | Trigger an event on all queried elements                             |
| `each()`        | callback: ItemCallback                                                      | Run a callback for all queried elements                              |
| `forEach()`     | callback: ItemCallback                                                      | alias of `.each()`                                                   |
| `first()`       | void                                                                        | Get the first `gQueryElement` of all queried elements                |
| `last()`        | void                                                                        | Get the last `gQueryElement` of all queried elements                 |
| `find()`        | query: string                                                               | Find descendant elements of all queried elements(matching the query) |
| `addClass()`    | className: string                                                           | Add class to all queried elements                                    |
| `removeClass()` | className: string                                                           | Remove class from all queried elements                               |
| `toggleClass()` | className: string                                                           | Toggle class from all queried elements                               |
| `prepend()`     | html: gQueryElement \| HTMLElement \| string                                | Prepend element or HTML to all queried elements                      |
| `append()`      | html: gQueryElement \| HTMLElement \| string                                | Append element or HTML to all queried elements                       |

## gQueryElement
The `gQueryElement` object has the following methods available:
| Method          | Parameters                                                                  | Description                                             |
| --------------- | --------------------------------------------------------------------------- | ------------------------------------------------------- |
| `on()`          | event: string<br>query: EventCallback \| string<br>callback?: EventCallback | Add an event handler to element                         |
| `trigger()`     | event: string                                                               | Trigger an event on element                             |
| `find()`        | query: string                                                               | Find descendant elements of element(matching the query) |
| `addClass()`    | className: string                                                           | Add class to element                                    |
| `removeClass()` | className: string                                                           | Remove class from element                               |
| `toggleClass()` | className: string                                                           | Toggle class from element                               |
| `prepend()`     | html: gQueryElement \| HTMLElement \| string                                | Prepend element or HTML to element                      |
| `append()`      | html: gQueryElement \| HTMLElement \| string                                | Append element or HTML to element                       |
| `data()`        | dataAttr: string<br>value?: any                                             | Get or set a data attribute                             |
| `attr()`        | attribute: string<br>value?: any                                            | Get or set an attribute                                 |
| `val()`         | value?: any                                                                 | Get or set an element's value attribute                 |
| `html()`        | html?: any                                                                  | Get or set an element's innerHtml                       |
