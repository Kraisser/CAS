import Swiper, {Navigation, Pagination, EffectFade} from 'swiper';

// Flags variables
let videoJsModule;
let activePlayer;
let casesSwiper;
let currTab = 'showreel-wrapper';

const casesItem = document.querySelectorAll('.cases-item');
const casesDot = document.querySelector('.cases-dot');

function casesDotController(target) {
	casesItem.forEach((item) => {
		item.classList.remove('active');
	});
	target.classList.add('active');
	const offsetTop = target.offsetTop;
	casesDot.style.transform = `translateY(${offsetTop}px`;
}

casesItem.forEach((item) => {
	item.addEventListener('click', (e) => {
		const target = e.currentTarget;

		casesDotController(target);
	});
});

// Cases Video
const sliderVideoTrigger = document.querySelectorAll('.cases-slide-item');
const mainShowreelVideoTriger = document.querySelector('.cases-showreel-wrapper');

async function loadVideojs() {
	try {
		if (videoJsModule) {
			return videoJsModule;
		}
		const videojs = await import('video.js');
		videoJsModule = videojs.default;
		return videoJsModule;
	} catch (error) {
		const errorMessage = 'Unable to load videoPlayer. ' + error.message;
		console.log(error);
		throw new Error(errorMessage);
	}
}

function setActivePlayer(videojsModule, videoEl) {
	activePlayer = videojsModule(videoEl, {
		controls: true,
		autoplay: true,
		preload: 'auto',
		restoreEl: true,
		controlBar: {
			pictureInPictureToggle: false,
		},
		fill: true,
		disablePictureInPicture: true,
		notSupportedMessage: 'There was an error uploading the video, please try again later',
	});
}

function startVideo(item) {
	if (activePlayer && !activePlayer.isDisposed()) {
		return;
	}

	const videoEl = item.querySelector('.vjs-cases-custom');

	item.classList.add('video-active');

	loadVideojs()
		.then((videojsModule) => {
			setActivePlayer(videojsModule, videoEl);
			activePlayer.play();
		})
		.catch((errorMessage) => {
			console.log('errorMessage: ', errorMessage);
			item.innerHTML = `<div class="custom-slider-error">${errorMessage}</div>`;
		});
}

function stopVideo(item) {
	item.classList.remove('video-active');

	if (activePlayer && !activePlayer.isDisposed()) {
		activePlayer.dispose();
	}
}

mainShowreelVideoTriger.addEventListener('click', () => {
	startVideo(mainShowreelVideoTriger);
});

sliderVideoTrigger.forEach((item) => {
	item.addEventListener('click', () => {
		startVideo(item);
	});
});

// Change Tab
const tabTriggers = document.querySelectorAll('.cases-item');

tabTriggers.forEach((item) => {
	item.addEventListener('click', () => {
		const tabValue = item.dataset.tab;

		if (!tabValue || currTab === tabValue) {
			return;
		}

		if (tabValue.match(/^(slider)/g)) {
			destroyCasesSlider(casesSwiper);
			showArrows();
			casesSwiper = createNewCasesSlider(`.cases-${tabValue}`);
		} else {
			hideArrows();
			destroyCasesSlider(casesSwiper);
		}

		const currTabWrapper = document.querySelector(`.cases-${currTab}`);
		currTabWrapper.classList.remove('active');

		if (activePlayer && !activePlayer.isDisposed()) {
			const videoWrapper = currTabWrapper.querySelector('.cases-slide-item');
			stopVideo(videoWrapper);
		}

		document.querySelector(`.cases-${tabValue}`).classList.add('active');

		currTab = tabValue;
	});
});

function createNewCasesSlider(selector) {
	const newSlider = new Swiper(`${selector}`, {
		slidesPerView: 1,
		effect: 'fade',
		fadeEffect: {
			crossFade: true,
		},
		speed: 600,
		allowTouchMove: false,
		navigation: {
			nextEl: '.cases-slide-arrow-next',
			prevEl: '.cases-slide-arrow-prev',
		},
		pagination: {
			el: '.cases-slider-pages',
			renderFraction: function (currentClass, totalClass) {
				return `<div class="${currentClass}"></div>
						<div>of</div>
						<div class="${totalClass}"></div>`;
			},
			totalClass: 'cases-slider-pages-max',
			currentClass: 'cases-slider-pages-curr',
			type: 'fraction',
		},
		breakpoints: {
			768: {
				navigation: {
					nextEl: '.slide-arrow-next',
					prevEl: '.slide-arrow-prev',
				},
				pagination: {
					el: '.slider-pages',
					renderFraction: function (currentClass, totalClass) {
						return `<div class="${currentClass}"></div>
						<div>of</div>
						<div class="${totalClass}"></div>`;
					},
					totalClass: 'slider-pages-max',
					currentClass: 'slider-pages-curr',
					type: 'fraction',
				},
			},
		},
		modules: [Navigation, Pagination, EffectFade],
	});

	newSlider.on('slideChange', () => {
		const prevSlide = newSlider.slides[newSlider.previousIndex].querySelector('.cases-slide-item');

		if (prevSlide) {
			stopVideo(prevSlide);
		}
	});

	return newSlider;
}

function destroyCasesSlider(instance) {
	if (instance) {
		instance.destroy(true, false);
	}
}

// arrows Controller
const messengerWrapper = document.querySelector('.desc-messenger-wrapper');
const sliderCtrlWrapper = document.querySelector('.desc-slider-controls');
const casesMobileCtrl = document.querySelector(`.cases-slider-controls`);

function showArrows() {
	messengerWrapper.classList.add('hidden');
	sliderCtrlWrapper.classList.remove('hidden');
	casesMobileCtrl.classList.remove('hidden');
}
function hideArrows() {
	messengerWrapper.classList.remove('hidden');
	sliderCtrlWrapper.classList.add('hidden');
	casesMobileCtrl.classList.add('hidden');
}

window.addEventListener('pageSwitch', (e) => {
	if (e.detail.pageId === 'cases' && currTab.match(/^(slider)/g)) {
		showArrows();
	} else {
		hideArrows();
	}
});
