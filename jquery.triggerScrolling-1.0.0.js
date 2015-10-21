/*!
 * jQuery TriggerScrolling v1.0.0
 *
 * Created by
 * Christian Fortes
 * https://github.com/christianfortes
 *
 * Dependencies: jQuery
 *
 * Released under the MIT license
 * https://github.com/christianfortes/triggerscrolling
 *
 * Date: 2015-10-21T20:30Z
 */

var triggerScrolling = (function () {
	'use strict';

	var self,
		options,
		arr = new Array,
		settings = {
			debug: false,
			trigger: {
				className: '-js-trigger-scrolling-active'
			},
			elements: {
				data: 'data-trigger-scrolling',
				attr: {
					top: 'data-trigger-scrolling-top',
					height: 'data-trigger-scrolling-height'
				}
			},
			scroll: {
				margin: {
					subtract: 0,
					sum: 0
				}
			}
		};

	var triggerScrolling = {
		init: function (customSettings, fnCallback) {
			self = this;

			if (window.jQuery) {
				options = $.extend(true, settings, customSettings);

				$('[' + options.elements.data + ']').each(function (index, el) {
					var elementPositionTop,
						elementHeight = $(this).outerHeight();

					if (options.scroll.margin.subtract != 0) {
						elementPositionTop = ($(this).position().top - options.scroll.margin.subtract);
					} else if (options.scroll.margin.sum != 0) {
						elementPositionTop = ($(this).position().top + options.scroll.margin.sum);
					} else {
						elementPositionTop = $(this).position().top;
					}

					$(this).attr(options.elements.attr.top, elementPositionTop);
					$(this).attr(options.elements.attr.height, elementHeight);

					arr.push({
						identifier: $(this).attr(options.elements.data),
						element: $(this),
						top: elementPositionTop,
						height: elementHeight
					});
				});

				$(document).ready(function () {
					self.selector($(window).scrollTop(), fnCallback);
				});

				$(window).on('scroll', function (event) {
					self.selector($(window).scrollTop(), fnCallback);
				});
			} else {
				console.error(self.messages.jquery);
			}
		},
		selector: function (scroll, fnCallback) {
			var arrLength = (arr.length),
				last = (arr.length - 1),
				first = (arr.length - arr.length),
				flags, prev, next;

			for (var i = 0; i < arrLength; i++) {
				if (scroll >= arr[i].top && scroll <= (arr[i].top + arr[i].height)) {
					if (i <= 0) {
						prev = new Object;
						prev.identifier = null;
						prev.element = null;
						prev.top = null;
						prev.height = null;
					} else {
						prev = arr[i - 1];
					}

					if (i >= last) {
						next = new Object;
						next.identifier = null;
						next.element = null;
						next.top = null;
						next.height = null;
					} else {
						next = arr[i + 1];
					}

					arr[i].element.addClass(options.trigger.className);

					flags = {
						'first': {
							'identifier': arr[first].identifier,
							'element': arr[first].element,
							'top': arr[first].top,
							'height': arr[first].height
						},
						'last': {
							'identifier': arr[last].identifier,
							'element': arr[last].element,
							'top': arr[last].top,
							'height': arr[last].height
						},
						'controls': {
							'prev': {
								'identifier': prev.identifier,
								'element': prev.element,
								'top': prev.top,
								'height': prev.height
							},
							'current': {
								'identifier': arr[i].identifier,
								'element': arr[i].element,
								'top': arr[i].top,
								'height': arr[i].height
							},
							'next': {
								'identifier': next.identifier,
								'element': next.element,
								'top': next.top,
								'height': next.height
							},
						}
					}

					if (options.debug) {
						return fnCallback(flags);
					}

					break;
				} else {
					$('[' + options.elements.data + ']').removeClass(options.trigger.className);
				}
			};
		},
		destroy: function () {
			arr = new Array;

			$('[' + options.elements.data + ']').each(function (index, el) {
				$(this).removeClass(options.trigger.className);
				$(this).removeAttr(options.elements.attr.top);
				$(this).removeAttr(options.elements.attr.height);
			});
		},
		messages: {
			jquery: 'TriggerScrolling requiring jQuery library! Download in: http://code.jquery.com/jquery-1.11.3.min.js'
		}
	};

	return triggerScrolling;
}(window));

document.addEventListener("DOMContentLoaded", function (event) {
	triggerScrolling.init(null, function (obj) {
		console.log(obj);
	});
});