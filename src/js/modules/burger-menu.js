export default function burger(mobileMenuWrapper, burgerBut) {
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

		mobileMenuWrapper.classList.add('burger-menu-active');
	};

	const burgerClose = () => {
		burgerBut.classList.remove('burger-active');
		burgerBut.classList.add('burger-closed');

		mobileMenuWrapper.classList.remove('burger-menu-active');
	};

	burgerBut.addEventListener('click', toggleMenu);
	mobileMenuWrapper.addEventListener('click', (e) => burgerClose(e, burgerBut));
}
