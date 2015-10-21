var triggerScroll = (function () {
	'use strict';
	var arr;

	var triggerScroll = {
		init: function (elementSubtract) {
			arr = [];

			$('[data-triggerscroll]').each(function (index, el) {
				elementSubtract = (elementSubtract == false ? 0 : elementSubtract);
				var topElement = ($(this).position().top - elementSubtract);

				$(this).attr('data-triggerscroll-top', topElement);

				arr.push({
					'top': topElement,
					'identifier': $(this).data('triggerscroll')
				});
			});
		},
		selector: function (scrollTop, callback) {
			var last = (arr.length - 1),
				first = (arr.length - arr.length),
				flags,
				prev,
				next;

			// arr.top = element position top
			// arr.identifier = class or id element
			// scrollTop = window scrollTop
			// calback = function return current element
			for (var i = 0; i <= last; i++) {

				var index = i;
				index += 1;

				if (index <= last) {
					if (scrollTop >= arr[i].top && scrollTop <= arr[index].top) {
						prev = (i <= 0 ? null : arr[i - 1].identifier);
						next = (i >= (last) ? null : arr[i + 1].identifier);

						flags = {
							'prev': prev,
							'current': arr[i].identifier,
							'next': next,
							'first': arr[first].identifier,
							'last': arr[last].identifier
						};

						return callback(flags);
						break;
					}
				} else if (arr.length == i + 1) {
					prev = (i <= 0 ? null : arr[i - 1].identifier);
					next = (i >= (last) ? null : arr[i + 1].identifier);

					flags = {
						'prev': prev,
						'current': arr[i].identifier,
						'next': next,
						'first': arr[first].identifier,
						'last': arr[last].identifier
					};

					return callback(flags);
				}
			}
		}
	};

	return triggerScroll;
}());