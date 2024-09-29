export default function pageSwitchEvent(pageId) {
	const event = new CustomEvent('pageSwitch', {
		detail: {pageId: pageId},
	});

	window.dispatchEvent(event);
}
