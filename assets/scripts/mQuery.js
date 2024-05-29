/**
 * @callback eventCallback
 * @param {Event} event
 * @this {mQueryElement}
 */

/**
 * @callback itemCallback
 * @param {mQueryElement} item
 * @this {mQueryElement}
 */

class mQueryElement {
	/**
     * @param {HTMLElement} element
     */
    constructor(element) {
		this.element = element;
    }

	/**
	 * @param {string} dataAttr
	 * @param {any} value
	 */
	data(dataAttr, value) {
		if (typeof value !== 'undefined') {
			this.element.dataset[dataAttr] = value;
		}
		return this.element.dataset[dataAttr];
	}

	/**
	 * @param {string} className
	 */
	addClass(className) {
		this.element.classList.add(className);
	}

	/**
	 * @param {string} className
	 */
	removeClass(className) {
		this.element.classList.remove(className);
	}
}

class mQueryNodeList {
	/** @type {mQueryElement[]} */
	items = [];

	constructor(nodelist) {
		this.items = Array.from(nodelist).map(node => new mQueryElement(node));
	}

	/**
	 * @param {string} event
	 * @param {eventCallback} callback
	 * @returns self
	 */
	on(event, callback) {
		this.items.forEach((item) => {
			item.element.addEventListener(event, callback.bind(item));
		});
		return this;
	}

	/**
	 * @param {itemCallback} callback
	 */
	each(callback) {
		this.items.forEach(item => callback.bind(item)(item));
	}

	/**
	 * @returns {mQueryElement}
	 */
	first() {
		return this.items[0].element;
	}

	/**
	 * @returns {mQueryElement}
	 */
	last() {
		return this.items[(this.items.length - 1)].element;
	}
}

/**
 * matQuery - it's like jQuery but for Mathieu
 * @param {string} query
 * @param {HTMLElement|string} context
 * @returns {mQueryNodeList}
 */
function mQuery(query, context) {
	let root = document;
	if (context) {
		if (context instanceof HTMLElement) {
			root = context;
		} else if (typeof context === 'string') {
			root = document.querySelector(context);
		}
	}
	return new mQueryNodeList(root.querySelectorAll(query));
}

export const mQ = (query, context) => mQuery(query, context);

export default mQuery;