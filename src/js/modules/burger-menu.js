export default function burger(burgerWrappers, burgerBut) {
	const toggleMenu = (e) => {
		if (!burgerBut.classList.contains('burger-active')) {
			burgerOpen(e);
		} else {
			burgerClose();
		}
	};

	const burgerOpen = (e) => {
		e.stopPropagation();
		burgerBut.classList.remove('burger-closed');
		burgerBut.classList.add('burger-active');

		burgerWrappers.forEach((item) => {
			item.classList.add('burger-menu-active');
		});
	};

	const burgerClose = () => {
		burgerBut.classList.remove('burger-active');
		burgerBut.classList.add('burger-closed');

		burgerWrappers.forEach((item) => {
			item.classList.remove('burger-menu-active');
		});
	};

	burgerBut.addEventListener('click', toggleMenu);
	burgerWrappers.forEach((item) => {
		item.addEventListener('click', (e) => burgerClose(e, burgerBut));
	});
}
