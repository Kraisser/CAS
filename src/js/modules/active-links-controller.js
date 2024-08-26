export default function activeLinksController(navList = [], activeClass) {
	if (navList && activeClass) {
		return function (id) {
			navList.forEach((linkList) => {
				linkList.querySelectorAll(`a`).forEach((item) => item.classList.remove(activeClass));
				console.log('linkList: ', linkList);
				const newActiveLinks = linkList.querySelectorAll(`a[href^="#${id}"]`);

				console.log('newActiveLinks: ', newActiveLinks);
				newActiveLinks.forEach((item) => item.classList.add(activeClass));
			});
		};
	}
}
