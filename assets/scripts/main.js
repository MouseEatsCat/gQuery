import mQuery from "./mQuery.js";

const filterAll = mQuery(".gallery-filter[data-filter=\"*\"]").first();
const filters   = mQuery(".gallery-filter");
const tiles     = mQuery(".tiles .tile");
let lastClicked = null;

function executeFilter(category) {
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
	executeFilter(this.data('filter'));

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
