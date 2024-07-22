var gQueryElement = /** @class */ (function () {
    function gQueryElement(element) {
        this.element = element;
    }
    gQueryElement.prototype.on = function (event, query, callback) {
        var callback_function = callback;
        if (typeof query === 'function') {
            callback_function = query;
        }
        var addEventListener = function (element) {
            element.element.addEventListener(event, callback_function.bind(element));
        };
        if (typeof query !== 'function') {
            var items = gQuery(query, this.element);
            items.each(function (item) { return addEventListener(item); });
            return;
        }
        addEventListener(this);
        return this;
    };
    gQueryElement.prototype.trigger = function (event) {
        var eventObj = new CustomEvent(event);
        this.element.dispatchEvent(eventObj);
        return this;
    };
    gQueryElement.prototype.find = function (query) {
        var allItems = [];
        allItems.push.apply(allItems, gQuery(query, this.element).items);
        return new gQueryElementList(allItems);
    };
    gQueryElement.prototype.data = function (dataAttr, value) {
        if (typeof value !== 'undefined') {
            this.element.dataset[dataAttr] = value;
        }
        return this.element.dataset[dataAttr];
    };
    gQueryElement.prototype.addClass = function (className) {
        this.element.classList.add(className);
    };
    gQueryElement.prototype.removeClass = function (className) {
        this.element.classList.remove(className);
    };
    gQueryElement.prototype.toggleClass = function (className) {
        this.element.classList.toggle(className);
    };
    gQueryElement.prototype.attr = function (attribute, value) {
        if (typeof value !== 'undefined') {
            this.element.setAttribute(attribute, value);
            return this;
        }
        return this.element.getAttribute(attribute);
    };
    gQueryElement.prototype.val = function (value) {
        return this.attr('value', value);
    };
    gQueryElement.prototype.html = function (html) {
        var oldHtml = this.element.innerHTML;
        if (typeof html !== 'undefined') {
            if (typeof html.toString === 'function') {
                this.element.innerHTML = html.toString();
            }
            return this;
        }
        return oldHtml;
    };
    gQueryElement.prototype.prepend = function (html) {
        if (typeof html !== 'undefined') {
            if (html instanceof gQueryElement) {
                this.element.prepend(html.element);
            }
            else if (html instanceof HTMLElement) {
                this.element.prepend(html);
            }
            else {
                if (typeof html.toString === 'function') {
                    html = html.toString();
                }
                this.element.innerHTML = html + this.element.innerHTML;
            }
        }
        return this;
    };
    gQueryElement.prototype.append = function (html) {
        if (typeof html !== 'undefined') {
            if (html instanceof gQueryElement) {
                this.element.appendChild(html.element);
            }
            else if (html instanceof HTMLElement) {
                this.element.appendChild(html);
            }
            else {
                if (typeof html.toString === 'function') {
                    html = html.toString();
                }
                this.element.innerHTML += html;
            }
        }
        return this;
    };
    return gQueryElement;
}());
var gQueryElementList = /** @class */ (function () {
    function gQueryElementList(nodelist) {
        this.items = [];
        if (nodelist instanceof NodeList) {
            this.items = Array.from(nodelist).map(function (node) {
                if (node instanceof gQueryElement) {
                    return node;
                }
                return new gQueryElement(node);
            });
        }
        else {
            this.items = nodelist;
        }
    }
    gQueryElementList.prototype[Symbol.iterator] = function () {
        var _this = this;
        var index = -1;
        return {
            next: function () {
                index++;
                if (index < _this.items.length) {
                    return { value: _this.items[index], done: false };
                }
                return { value: undefined, done: true };
            }
        };
    };
    /**
     * Add an event handler to all elements
     */
    gQueryElementList.prototype.on = function (event, query, callback) {
        this.items.forEach(function (item) {
            item.on(event, query, callback);
        });
        return this;
    };
    gQueryElementList.prototype.trigger = function (event) {
        var eventObj = new CustomEvent(event);
        this.items.forEach(function (item) {
            item.element.dispatchEvent(eventObj);
        });
        return this;
    };
    /**
     * Iterate through all elements
     */
    gQueryElementList.prototype.each = function (callback) {
        this.items.forEach(function (item) { callback.bind(item)(item); });
    };
    /**
     * Iterate through all elements
     */
    gQueryElementList.prototype.forEach = function (callback) {
        this.each(callback);
    };
    gQueryElementList.prototype.first = function () {
        return this.items[0];
    };
    gQueryElementList.prototype.last = function () {
        return this.items[(this.items.length - 1)];
    };
    gQueryElementList.prototype.find = function (query) {
        var allItems = [];
        this.items.forEach(function (item) {
            allItems.push.apply(allItems, gQuery(query, item.element).items);
        });
        return new gQueryElementList(allItems);
    };
    gQueryElementList.prototype.addClass = function (className) {
        this.each(function (item) { item.addClass(className); });
    };
    gQueryElementList.prototype.removeClass = function (className) {
        this.each(function (item) { item.removeClass(className); });
    };
    gQueryElementList.prototype.toggleClass = function (className) {
        this.each(function (item) {
            item.toggleClass(className);
        });
    };
    gQueryElementList.prototype.prepend = function (html) {
        if (typeof html !== 'undefined') {
            var newHtml_1 = html;
            if (typeof html == 'object') {
                var element = html instanceof gQueryElement ? html.element : html;
                newHtml_1 = element.cloneNode(true);
            }
            this.each(function (element) {
                element.prepend(newHtml_1);
            });
        }
        return this;
    };
    gQueryElementList.prototype.append = function (html) {
        if (typeof html !== 'undefined') {
            var newHtml_2 = html;
            if (typeof html === 'object') {
                var element = html instanceof gQueryElement ? html.element : html;
                newHtml_2 = element.cloneNode(true);
            }
            this.each(function (element) {
                element.append(newHtml_2);
            });
        }
        return this;
    };
    return gQueryElementList;
}());
/**
 * gevryQuery - it's like jQuery but for Mathieu Gévry
 */
function gQuery(query, context) {
    if (typeof query === 'function') {
        document.addEventListener('DOMContentLoaded', query);
        return new gQueryElementList([]);
    }
    if (query instanceof gQueryElementList) {
        return query;
    }
    if (query instanceof gQueryElement) {
        return new gQueryElementList([query]);
    }
    // Use document as context by default
    var root = document;
    if (context) {
        if (context instanceof gQueryElement) {
            root = context.element;
        }
        else if (context instanceof HTMLElement) {
            root = context;
        }
        else if (typeof context === 'string') {
            root = document.querySelector(context);
        }
    }
    return new gQueryElementList(root.querySelectorAll(query));
}
export function gQ(query, context) {
    return gQuery(query, context);
}
;
export default gQuery;
