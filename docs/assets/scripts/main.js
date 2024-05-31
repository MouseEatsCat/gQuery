import $ from "../../dist/gQuery.min.js";

const filterAll = $(".gallery-filter[data-filter=\"*\"]").first().element;
const filters   = $(".gallery-filter");
const tiles     = $(".tiles .tile");
let lastClicked = null;

/**
 * Filter all tiles by category
 * @param {string} category
 * @returns {void}
 */
function filterTiles(category) {
	if (category === '*') {
		tiles.each(tile => {
			tile.addClass('active');
		});
		return;
	}

	tiles.each(tile => {
		const categories = tile.data('categories').split(',');
		const filteredCategories = categories.filter(tile_cat => tile_cat === category);

		if (filteredCategories.length) {
			tile.addClass('active');
			return;
		}
		tile.removeClass('active');
	});
}

filters.on('click', function (e) {
	filterTiles(this.data('filter'));

	// Do this on click
	filters.each(function(filter) {
		filter.removeClass('active');
	});

	if (this === lastClicked) {
		e.preventDefault();

		lastClicked = null;
		filterAll.click();
		return;
	}

	this.addClass('active');
	lastClicked = this;
});

filterAll.click()
