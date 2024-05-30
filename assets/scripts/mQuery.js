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
		this.items = Array.from(nodelist).map(node => {
			if (node instanceof mQueryElement) {
				return node
			}
			return new mQueryElement(node)
		});
	}

	/**
	 * @returns {Iterator<mQueryElement>}
	 */
	[Symbol.iterator]() {
		let index = -1;
		return {
			next: () => {
				index++;
				if (index < this.items.length) {
					return {value: this.items[index], done: false};
				}
				return {done: true};
			}
		};
	}

	/**
	 * Add an event handler to all elements
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
	 * Iterate through all elements
	 * @param {itemCallback} callback
	 */
	each(callback) {
		this.items.forEach(item => callback.bind(item)(item));
	}

	/**
	 * Iterate through all elements
	 * @param {itemCallback} callback
	 */
	forEach(callback) {
		this.each(callback)
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

	/**
	 * @param {string} query
	 * @returns {mQueryNodeList}
	 */
	find(query) {
		const allItems = [];

		this.items.forEach((item) => {
			allItems.push(...mQuery(query, item.element).items);
		});

		return new mQueryNodeList(allItems);
	}

	/**
	 * @param {string} className
	 */
	addClass(className) {
		this.each((item) => { item.addClass(className) })
	}

	/**
	 * @param {string} className
	 */
	removeClass(className) {
		this.each((item) => { item.removeClass(className) })
	}
}

/**
 * matQuery - it's like jQuery but for Mathieu
 * @param {string|mQueryElement} query
 * @param {HTMLElement|string} context
 * @returns {mQueryNodeList}
 */
function mQuery(query, context) {
	if (query instanceof mQueryElement) {
		return new mQueryNodeList([query.element]);
	}

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