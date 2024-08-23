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
	console.log('id: ', id);
	const target = document.querySelector(`#${id}`);

	if (target) {
		console.log('target: ', target);
		console.log('scroll');
		target.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	}

	if (callbacks) {
		callbacks.forEach((func) => func(id));
	}
}
