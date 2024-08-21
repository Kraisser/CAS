export default function smoothScroll(allAnchorLinks, callbacks) {
	if (allAnchorLinks) {
		allAnchorLinks.forEach((item) => {
			item.addEventListener('click', (e) => {
				e.preventDefault();

				const id = item.getAttribute('href').slice(1);

				const target = document.querySelector(`#${id}`);

				console.log('callbacks: ', callbacks);
				if (callbacks) {
					callbacks.forEach((func) => func(id));
				}

				if (target) {
					target.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					});
				}
			});
		});
	}
}
