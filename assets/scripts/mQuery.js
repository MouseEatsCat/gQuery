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
	 * @returns {string}
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
	 * @param {eventCallback|string} query Query or Callback
	 * @param {eventCallback} callback
	 * @returns self
	 */
	on(event, query, callback) {
		let callback_function = callback;

		if (typeof query === 'function') {
			callback_function = query;
		}

		this.items.forEach((item) => {
			const addEventListener = (item) => {
				item.element.addEventListener(event, callback_function.bind(item));
			};

			if (typeof query !== 'function') {
				const items = mQuery(query, item.element);
				items.each(item => addEventListener(item));
				return;
			}

			addEventListener(item);
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
	// Use document as context by default
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