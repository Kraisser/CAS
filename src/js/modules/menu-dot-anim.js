export default function menuDotCtrl(dot, wrapper) {
	return () => {
		const target = wrapper.querySelector(`.active`);
		const wrapperX = wrapper.offsetLeft;
		const targetX = target.offsetLeft;
		const targetHalf = target.offsetWidth / 2;
		const dotX = targetX - wrapperX + targetHalf - dot.offsetWidth / 2;
		dot.style.transform = `translateX(${dotX}px)`;
	};
}
