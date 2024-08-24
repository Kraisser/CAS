export default function smoothScroll(currentId, allAnchorLinks, callbacks) {
	if (currentId) {
		navigate(currentId, callbacks);
	}

	if (allAnchorLinks) {
		allAnchorLinks.forEach((item) => {
			item.addEventListener('click', (e) => {
				e.preventDefault();

				const id = item.getAttribute('href').slice(1);

				navigate(id, callbacks);
			});
		});
	}
}

function navigate(id, callbacks) {
	const target = document.querySelector(`#${id}`);

	if (target) {
		target.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	}

	if (callbacks) {
		callbacks.forEach((func) => func(id));
	}
}
