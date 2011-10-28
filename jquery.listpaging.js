/**
 * "Large list auto paging" jQuery plugin
 *
 * @author     RaNa design associates, inc.
 * @copyright  2011 RaNa design associates, inc.
 * @license    http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version    Release: 1.0
 * Created: 2010-07-16 21:44:58.
 * Modified: 2010-07-26 17:42:13
 */

(function($) {
// main jQuery function
$.fn.listPaging = function(opt) {
	return new ListPaging(this, opt);
};

// constructor object
var ListPaging = function(obj, opt) {
	var self = this;
	this.obj = obj;
	this.opt = opt;
	// Default options
	this.options = {
		listWidth: 160,
		listLength: 5,
		listItem: 'li',
		list: 'ul',
		prevText: '&laquo; Prev',
		nextText: 'Next &raquo;',
		listContainerClassName: 'listContainer',
		animation: 0,
		animationDuration: 200,
		animationEasing: 'swing',
		animationCallback: function () {
			self.$navOverlay.hide();
		}
	};
	this.init();
	// for Method Chain
	return obj;
};
ListPaging.prototype = {
	init: function() {
		$.extend(this.options, this.opt);
		var options = this.options;
		// object properties
		this.crIndex = 0;
		this.contentArray = [];
		this.$content = this.obj.clone();
		this.$li = this.$content.find('li');
		this.liGroupLength = Math.ceil(this.$li.length / options.listLength);
		this.$container = $('<div class="' + options.listContainerClassName + '"></div>')
			.addClass(this.obj[0].className)
			.css({ width: options.listWidth });
		this.$containerInner = $('<div class="' + options.listContainerClassName + 'Inner"></div>')
			.css({ width: options.listWidth * this.liGroupLength });
		this.$prevLink = $('<span class="prev"><a href="#">' + options.prevText + '</a></span>');
		this.$nextLink = $('<span class="next"><a href="#">' + options.nextText + '</a></span>');
		this.$navOverlay = $('<div class="navOverlay"></div>');
		// method execution
		this.makeGroupList();
		this.createNav();
		this.setupNav();
		// reflow processing
		this.$container.insertBefore(this.obj);
		this.adjustHeight($(options.list, this.$container[0]))
		this.obj.remove();
	},
	makeGroupList: function() {
		var options = this.options,
			contentArray = this.contentArray, 
			$containerInner = this.$containerInner;
		for (var i=0; i<this.liGroupLength; i++) {
			contentArray[i] = $('<' + options.list + '></' + options.list + '>');
			contentArray[i].css({ width: options.listWidth });
			makeList(contentArray[i], this.$li, i);
		}
		$.each(contentArray, function(i) {
			$containerInner.append(contentArray[i]);
		});
		this.$container.append($containerInner);

		function makeList($wrapper, $content, index) {
			var listLen = options.listLength;
			for (var i=index*listLen; i<((index+1)*listLen); i++) {
				if ($content[i]) {
					$wrapper.append($content[i]);
				}
			}
		}
	}, 
	setupList: function() {
		var options = this.options, 
			crIndex = this.crIndex, 
			contentArray = this.contentArray;
		if (options.animation === 1) {
			this.$containerInner.animate({
				marginLeft: -1 * options.listWidth * crIndex
			},
			options.animationDuration,
			options.animationEasing,
			options.animationCallback);
		} else {
			for (var i=0, l=contentArray.length; i<l; i++) {
				if (i === crIndex) {
					contentArray[i].show();
				} else {
					contentArray[i].hide();
				}
			}
		}
	}, 
	setupNav: function() {
		var contentArray = this.contentArray, 
			crIndex = this.crIndex, 
			$prevLink = this.$prevLink, 
			$nextLink = this.$nextLink;
		if (contentArray.length === 1) {
			$prevLink.hide();
			$nextLink.hide();
		} else {
			if (crIndex === 0) {
				$prevLink.hide();
				$nextLink.show();
			} else if (crIndex === contentArray.length - 1) {
				$prevLink.show();
				$nextLink.hide();
			} else {
				$prevLink.show();
				$nextLink.show();
			}
		}
	}, 
	createNav: function() {
		var self = this, 
			options = this.options;
		this.$prevLink.find('a').click(function(e) {
			e.preventDefault();
			self.changeContent('prev');
		});
		this.$nextLink.find('a').click(function(e) {
			e.preventDefault();
			self.changeContent('next');
		});

		var $navContainer = $('<p class="nav"></p>')
			.append(this.$prevLink)
			.append(this.$nextLink);
		this.$container.append($navContainer).append(this.$navOverlay);
	},
	changeContent: function(direction) {
		if (this.options.animation === 1) {
			this.$containerInner.queue([]);
			this.$navOverlay.show();
		}
		switch (direction) {
			case 'next': this.crIndex ++; break;
			case 'prev': this.crIndex --; break;
		}
		this.setupList();
		this.setupNav();
	},
	adjustHeight: function (elements) {
		var max = 0;
		elements.each(function (i, item) {
			var h = $(item).height();
			if (max < h) {
				max = h;
			}
		});
		elements.each(function (i, item) {
			$(item).height(max);
		});
	}

};

})(jQuery);

