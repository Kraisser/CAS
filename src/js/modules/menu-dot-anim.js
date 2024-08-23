export default function menuDotCtrl(dot, wrapper) {
	return (id) => {
		const targetId = id === '' ? 'home' : id;
		const target = wrapper.querySelector(`[href="#${targetId}"]`);
		const wrapperX = wrapper.offsetLeft;
		const targetX = target.offsetLeft;
		const targetHalf = target.offsetWidth / 2;
		const dotX = targetX - wrapperX + targetHalf - dot.offsetWidth / 2;
		dot.style.transform = `translateX(${dotX}px)`;
	};
}
