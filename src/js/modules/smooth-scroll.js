// export default function smoothScroll(currentId, callbacks = []) {
// 	if (!currentId) {
// 		return;
// 	}

// 	const target = document.querySelector(`#${currentId}`);

// 	if (target) {
// 		target.scrollIntoView({
// 			behavior: 'smooth',
// 			block: 'start',
// 		});

// 		if (callbacks) {
// 			callbacks.forEach((func) => func(currentId));
// 		}
// 	}
// }

// export function linkBinder(allAnchorLinks = [], callbacks) {
// 	if (allAnchorLinks) {
// 		allAnchorLinks.forEach((item) => {
// 			item.addEventListener('click', (e) => {
// 				e.preventDefault();

// 				const id = item.getAttribute('href').slice(1);

// 				smoothScroll(id, callbacks);
// 			});
// 		});
// 	}
// }

export default function smoothScroll(allAnchorLinks = [], callbacks) {
	const navigate = (currId, callbacks = []) => {
		if (!currId) {
			return;
		}

		const target = document.querySelector(`#${currId}`);

		if (target) {
			target.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});

			if (callbacks && callbacks.length > 0) {
				callbacks.forEach((func) => func(currId));
			}
		}
	};

	if (allAnchorLinks && allAnchorLinks.length > 0) {
		allAnchorLinks.forEach((item) => {
			item.addEventListener('click', (e) => {
				e.preventDefault();

				const id = item.getAttribute('href').slice(1);

				navigate(id, callbacks);
			});
		});
	}

	return navigate;
}
