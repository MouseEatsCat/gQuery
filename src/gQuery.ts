type EventCallback = (this: gQueryElement, event: Event) => void;
type ItemCallback = (this: gQueryElement, event: gQueryElement) => void;

class gQueryElement {
	element: HTMLElement;

    constructor(element: HTMLElement) {
		this.element = element;
    }

	on(event: string, query: EventCallback | string, callback?: EventCallback): this {
		let callback_function = callback;

		if (typeof query === 'function') {
			callback_function = query;
		}

		const addEventListener = (element: gQueryElement) => {
			element.element.addEventListener(event, callback_function.bind(element));
		};

		if (typeof query !== 'function') {
			const items = gQuery(query, this.element);
			items.each(item => addEventListener(item));
			return;
		}

		addEventListener(this);
		return this;
	}

	trigger (event: string): this {
		const eventObj = new CustomEvent(event);
		this.element.dispatchEvent(eventObj);
		return this;
	}

	find(query: string): gQueryElementList {
		const allItems: gQueryElement[] = [];

		allItems.push(...gQuery(query, this.element).items);

		return new gQueryElementList(allItems);
	}

	data(dataAttr: string, value?: any): string {
		if (typeof value !== 'undefined') {
			this.element.dataset[dataAttr] = value;
		}
		return this.element.dataset[dataAttr];
	}

	addClass(className: string) {
		this.element.classList.add(className);
	}

	removeClass(className: string) {
		this.element.classList.remove(className);
	}

	toggleClass(className: string) {
		this.element.classList.toggle(className);
	}

	attr(attribute: string, value?: string): string | this {
		if (typeof value !== 'undefined') {
			this.element.setAttribute(attribute, value);
			return this;
		}
		return this.element.getAttribute(attribute);
	}

	val(value?: string): string | this {
		return this.attr('value', value);
	}

	html(html?: string): string | this {
		const oldHtml = this.element.innerHTML;

		if (typeof html !== 'undefined') {
			if (typeof html.toString === 'function') {
				this.element.innerHTML = html.toString();
			}
			return this;
		}

		return oldHtml;
	}

	prepend(html: gQueryElement | HTMLElement | string): this {
		if (typeof html !== 'undefined') {
			if (html instanceof gQueryElement) {
				this.element.prepend(html.element);
			} else if (html instanceof HTMLElement) {
				this.element.prepend(html);
			} else {
				if (typeof html.toString === 'function') {
					html = html.toString();
				}
				this.element.innerHTML = html + this.element.innerHTML;
			}
		}

		return this;
	}

	append(html: gQueryElement | HTMLElement | string): this {
		if (typeof html !== 'undefined') {
			if (html instanceof gQueryElement) {
				this.element.appendChild(html.element);
			}  else if (html instanceof HTMLElement) {
				this.element.appendChild(html);
			} else {
				if (typeof html.toString === 'function') {
					html = html.toString();
				}
				this.element.innerHTML += html;
			}
		}

		return this;
	}
}

class gQueryElementList {
	items: gQueryElement[] = [];

	constructor(nodelist: NodeListOf<HTMLElement> | gQueryElement[]) {
		if (nodelist instanceof NodeList) {
			this.items = Array.from(nodelist).map(node => {
				if (node instanceof gQueryElement) {
					return node
				}
				return new gQueryElement(node)
			});
		} else {
			this.items = nodelist;
		}
	}

	[Symbol.iterator](): Iterator<gQueryElement> {
		let index = -1;
		return {
			next: (): IteratorResult<gQueryElement> => {
				index++;
				if (index < this.items.length) {
					return {value: this.items[index], done: false};
				}
				return {value: undefined, done: true};
			}
		};
	}

	/**
	 * Add an event handler to all elements
	 */
	on(event: string, query: EventCallback | string, callback?: EventCallback): this {
		this.items.forEach((item) => {
			item.on(event, query, callback);
		});
		return this;
	}

	trigger (event: string): this {
		const eventObj = new CustomEvent(event);
		this.items.forEach((item) => {
			item.element.dispatchEvent(eventObj);
		});
		return this;
	}

	/**
	 * Iterate through all elements
	 */
	each(callback: ItemCallback) {
		this.items.forEach(item => { callback.bind(item)(item) });
	}

	/**
	 * Iterate through all elements
	 */
	forEach(callback: ItemCallback) {
		this.each(callback)
	}

	first(): gQueryElement {
		return this.items[0];
	}

	last(): gQueryElement {
		return this.items[(this.items.length - 1)];
	}

	find(query: string): gQueryElementList {
		const allItems: gQueryElement[] = [];

		this.items.forEach((item) => {
			allItems.push(...gQuery(query, item.element).items);
		});

		return new gQueryElementList(allItems);
	}

	addClass(className: string) {
		this.each((item) => { item.addClass(className) })
	}

	removeClass(className: string) {
		this.each((item) => { item.removeClass(className) })
	}

	toggleClass(className: string) {
		this.each((item) => {
			item.toggleClass(className)
		})
	}

	prepend(html: gQueryElement | HTMLElement | string): this {
		if (typeof html !== 'undefined') {
			let newHtml = html;

			if (typeof html == 'object') {
				const element = html instanceof gQueryElement ? html.element : html;
				newHtml = element.cloneNode(true) as HTMLElement;
			}

			this.each((element) => {
				element.prepend(newHtml)
			})
		}

		return this;
	}

	append(html: gQueryElement | HTMLElement | string): this {
		if (typeof html !== 'undefined') {
			let newHtml = html;

			if (typeof html === 'object') {
				const element = html instanceof gQueryElement ? html.element : html;
				newHtml = element.cloneNode(true) as HTMLElement;
			}

			this.each((element) => {
				element.append(newHtml)
			})
		}

		return this;
	}
}

/**
 * gevryQuery - it's like jQuery but for Mathieu Gévry
 */
function gQuery(
	query: string | gQueryElement | EventCallback,
	context: HTMLElement | string
): gQueryElementList {
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
	let root: ParentNode = document;

	if (context) {
		if (context instanceof gQueryElement) {
			root = context.element;
		} else if (context instanceof HTMLElement) {
			root = context;
		} else if (typeof context === 'string') {
			root = document.querySelector(context);
		}
	}
	return new gQueryElementList(root.querySelectorAll(query));
}

export function gQ(
	query: string | gQueryElement | EventCallback,
	context: string | HTMLElement
): gQueryElementList {
	return gQuery(query, context)
};

export default gQuery;