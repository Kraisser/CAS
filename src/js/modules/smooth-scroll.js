export default function smoothScroll(currId) {
	if (!currId) {
		return;
	}

	const target = document.querySelector(`#${currId}`);

	if (target) {
		target.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	}
}
