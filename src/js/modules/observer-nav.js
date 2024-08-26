export default function observerNav(observedEntriesSelector, callback) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					callback(entry.target.id);
				}
			});
		},
		{
			threshold: 0.1,
		}
	);

	const target = document.querySelector(`#${observedEntriesSelector}`);
	observer.observe(target);
}
