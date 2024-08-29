export default function swipeController(settings, callbackObj) {
	const body = document.querySelector('body');
	const touch = {};

	body.addEventListener('touchstart', (e) => touchHandle(e, 'start'));
	body.addEventListener('touchend', touchHandle);

	function touchHandle(e, pos) {
		const target = e.changedTouches[0];
		if (pos === 'start') {
			touch.sTime = e.timeStamp;
			touch.sX = target.clientX;
			touch.sY = target.clientY;
		} else {
			const eData = {
				eTime: e.timeStamp,
				eX: target.clientX,
				eY: target.clientY,
			};
			touchController(eData, settings);
		}
	}

	function touchController(eData, op) {
		const xDiff = eData.eX - touch.sX;
		const yDiff = eData.eY - touch.sY;
		const time = eData.eTime - touch.sTime;

		if (Math.abs(xDiff) > Math.abs(yDiff)) {
			return;
		}

		if (time < op.minTime || time > op.maxTime) {
			return;
		}

		if (Math.abs(yDiff) < op.minMove || Math.abs(yDiff) > op.maxMove) {
			return;
		}

		if (yDiff < 0) {
			// console.log('to top: ' + yDiff);
			callbackObj.toTop();
		} else {
			// console.log('to bot: ' + yDiff);
			callbackObj.toBot();
		}
	}
}
