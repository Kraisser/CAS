export default function navScroll(observedEntriesSelector, callback) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					callback(entry.target.id);
				}
			});
		},
		{
			threshold: 0.4,
		}
	);

	const target = document.querySelector(`#${observedEntriesSelector}`);
	observer.observe(target);
}
