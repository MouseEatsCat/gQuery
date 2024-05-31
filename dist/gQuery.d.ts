type EventCallback = (this: gQueryElement, event: Event) => void;
type ItemCallback = (this: gQueryElement, event: gQueryElement) => void;
declare class gQueryElement {
    element: HTMLElement;
    constructor(element: HTMLElement);
    on(event: string, query: EventCallback | string, callback?: EventCallback): this;
    find(query: string): gQueryElementList;
    data(dataAttr: string, value?: any): string;
    addClass(className: string): void;
    removeClass(className: string): void;
    attr(attribute: string, value?: string): string | this;
    val(value?: string): string | this;
    html(html?: string): string | this;
    prepend(html: gQueryElement | HTMLElement | string): this;
    append(html: gQueryElement | HTMLElement | string): this;
}
declare class gQueryElementList {
    items: gQueryElement[];
    constructor(nodelist: NodeListOf<HTMLElement> | gQueryElement[]);
    [Symbol.iterator](): Iterator<gQueryElement>;
    /**
     * Add an event handler to all elements
     */
    on(event: string, query: EventCallback | string, callback?: EventCallback): this;
    /**
     * Iterate through all elements
     */
    each(callback: ItemCallback): void;
    /**
     * Iterate through all elements
     */
    forEach(callback: ItemCallback): void;
    first(): gQueryElement;
    last(): gQueryElement;
    find(query: string): gQueryElementList;
    addClass(className: string): void;
    removeClass(className: string): void;
    prepend(html: gQueryElement | HTMLElement | string): this;
    append(html: gQueryElement | HTMLElement | string): this;
}
/**
 * gevryQuery - it's like jQuery but for Mathieu Gévry
 */
declare function gQuery(query: string | gQueryElement | EventCallback, context: HTMLElement | string): gQueryElementList;
export declare function gQ(query: string | gQueryElement | EventCallback, context: string | HTMLElement): gQueryElementList;
export default gQuery;
