export default function menuDotCtrl(dot, wrapper, mobile) {
	return (id) => {
		const targetId = id === '' ? 'home' : id;
		const target = wrapper.querySelector(`[href="#${targetId}"]`);

		if (mobile) {
			const targetY = target.offsetTop;
			const targetHeight = target.offsetHeight;
			const dotHeight = dot.offsetHeight;
			const dotY = targetY - targetHeight / 2 + dotHeight / 2;
			dot.style.transform = `translateY(${dotY}px)`;
			return;
		}

		const wrapperX = wrapper.offsetLeft;
		const targetX = target.offsetLeft;
		const targetHalf = target.offsetWidth / 2;
		const dotX = targetX - wrapperX + targetHalf - dot.offsetWidth / 2;
		dot.style.transform = `translateX(${dotX}px)`;
	};
}
