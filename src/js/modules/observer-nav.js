export default function observerNav(observedEntriesSelectors, callback) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					callback(entry.target.id);
				}
			});
		},
		{
			threshold: 0.6,
		}
	);

	if (observedEntriesSelectors) {
		observedEntriesSelectors.forEach((item) => {
			const target = document.querySelector(`#${item}`);
			observer.observe(target);
		});
	}
}
