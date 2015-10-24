/*
 * jQuery TriggerScrolling Plugin v1.0.2
 *
 * https://github.com/christianfortes/triggerScrolling
 *
 * Copyright (c) 2015 Christian Fortes
 * Released under the  license
 */
var triggerScrolling = (function () {
	'use strict';

	var self,
		options,
		arr = [],
		settings = {
			debug: true,
			trigger: {
				className: '-js-trigger-scrolling-active',
				execute: 'data-trigger-execute'
			},
			elements: {
				data: 'data-trigger-scrolling',
				destroy: 'data-trigger-scrolling-destroy',
				attr: {
					top: 'data-trigger-scrolling-top',
					height: 'data-trigger-scrolling-height',
					call: 'data-trigger-scrolling-call',
				}
			},
			scroll: {
				margin: {
					subtract: 0,
					sum: 0
				}
			}
		};

	var triggerScrolling = function (customSettings) {
		self = this;

		this.init = function (fnCallback) {
			if (window.jQuery) {
				options = $.extend(true, settings, customSettings);

				$('[' + options.elements.data + ']').each(function (index, el) {
					var elementPositionTop,
						elementHeight = $(this).outerHeight();

					if (options.scroll.margin.subtract !== 0) {
						elementPositionTop = ($(this).position().top - options.scroll.margin.subtract);
					} else if (options.scroll.margin.sum !== 0) {
						elementPositionTop = ($(this).position().top + options.scroll.margin.sum);
					} else {
						elementPositionTop = $(this).position().top;
					}

					if ($('body').attr(options.elements.destroy) !== true) {
						$(this).attr(options.elements.attr.top, elementPositionTop);
						$(this).attr(options.elements.attr.height, elementHeight);
						$(this).attr(options.elements.attr.call);
					}

					arr.push({
						identifier: $(this).attr(options.elements.data),
						element: $(this),
						top: elementPositionTop,
						height: elementHeight
					});
				});

				$(document).ready(function () {
					if ($('body').attr(options.elements.destroy) !== true) {
						self.selector($(window).scrollTop(), fnCallback);
					}
				});

				$(window).on('scroll', function (event) {
					if ($('body').attr(options.elements.destroy) !== true) {
						self.selector($(window).scrollTop(), fnCallback);
					}
				});
			} else {
				console.error(self.messages().jquery);
			}
		},
		this.selector = function (scroll, fnCallback) {
			var arrLength = (arr.length),
				last = (arr.length - 1),
				first = (arr.length - arr.length),
				flags, prev, prevI, next, nextI, bottom, top,
				dataCall, dataExecute,
				docHeight = $(document)[0].documentElement,
				winHeight = $(window)[0];

			for (var i = 0; i < arrLength; i++) {
				if (scroll >= arr[i].top && scroll <= (arr[i].top + arr[i].height)) {
					top = ($(window).scrollTop() <= 0 ? true : null);
					bottom = ((docHeight.scrollHeight - winHeight.innerHeight) == winHeight.pageYOffset ? true : null);

					if (i <= 0) {
						prev = {};
						prev.identifier = null;
						prev.element = null;
						prev.top = null;
						prev.height = null;
					} else {
						prev = arr[i - 1];
						prevI = [i - 1];
					}

					if (i >= last) {
						next = {};
						next.identifier = null;
						next.element = null;
						next.top = null;
						next.height = null;
					} else {
						next = arr[i + 1];
						nextI = [i + 1];
					}

					arr[i].element.addClass(options.trigger.className);

					flags = {
						'page': {
							'first': {
								'identifier': (arr[first].identifier !== "" ? arr[first].identifier : 'trigger-' + first),
								'element': arr[first].element,
								'top': arr[first].top,
								'height': arr[first].height
							},
							'last': {
								'identifier': (arr[last].identifier !== "" ? arr[last].identifier : 'trigger-' + last),
								'element': arr[last].element,
								'top': arr[last].top,
								'height': arr[last].height
							},
							'bottom': bottom,
							'top': top,
						},
						'controls': {
							'prev': {
								'identifier': (prev.identifier !== "" ? prev.identifier : 'trigger-' + prevI),
								'element': prev.element,
								'top': prev.top,
								'height': prev.height
							},
							'current': {
								'identifier': (arr[i].identifier !== "" ? arr[i].identifier : 'trigger-' + i),
								'element': arr[i].element,
								'top': arr[i].top,
								'height': arr[i].height
							},
							'next': {
								'identifier': (next.identifier !== "" ? next.identifier : 'trigger-' + nextI),
								'element': next.element,
								'top': next.top,
								'height': next.height
							},
						}
					};

					if (options.debug) {
						if (typeof fnCallback == 'function') {
							dataCall = $(flags.controls.current.element).attr(options.elements.attr.call);

							if (Boolean(dataCall) !== true) {
								$(flags.controls.current.element).attr(options.elements.attr.call, true);
								dataExecute = $(flags.controls.current.element).attr(options.trigger.execute);

								if (dataExecute !== undefined && dataExecute !== null && dataExecute !== "") {
									self.execute(flags, dataExecute);
								}

								return fnCallback(flags);
							}
						}
					}

					break;
				} else {
					$('[' + options.elements.data + ']').removeClass(options.trigger.className);
					$(arr[i].element).removeAttr(options.elements.attr.call);
				}
			}
		},
		this.destroy = function () {
			arr = [];

			$('body').attr(options.elements.destroy, true);

			$('[' + options.elements.data + ']').each(function (index, el) {
				$(this).removeClass(options.trigger.className);
				$(this).removeAttr(options.elements.attr.top);
				$(this).removeAttr(options.elements.attr.height);
				$(this).removeAttr(options.elements.attr.call);
			});
		},
		this.restore = function () {
			$('body').removeAttr(options.elements.destroy);
		},
		this.execute = function (flags, fnName) {
			var fn = self[fnName];
			if (typeof fn !== 'function') {
				console.error('Error: Function "' + fnName + '" not defined in scope triggerScrolling. http://github.com/custom-function');
			} else {
				return fn(flags);
			}
		},
		this.addMethod = function (fnName, fnMethodCallback) {
			self[fnName] = fnMethodCallback;
		},
		this.messages = function () {
			return {
				jquery: 'TriggerScrolling requiring jQuery library! Download in: http://code.jquery.com/jquery-1.11.3.min.js'
			};
		};
	};

	return triggerScrolling;
}(window));