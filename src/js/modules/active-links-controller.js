export default function activeLinksController(navList = [], activeClass, callback) {
	if (navList && activeClass) {
		return function (id) {
			navList.forEach((linkList) => {
				linkList.querySelectorAll(`a`).forEach((item) => item.classList.remove(activeClass));
				const newActiveLinks = linkList.querySelectorAll(`a[href^="#${id}"]`);

				newActiveLinks.forEach((item) => item.classList.add(activeClass));
			});
			callback(id);
		};
	}
}
