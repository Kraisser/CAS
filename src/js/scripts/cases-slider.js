import Swiper, {Navigation, Pagination, EffectFade} from 'swiper';

// Cases Slider
const casesSwiper = new Swiper('.cases-slider', {
	slidesPerView: 1,
	effect: 'fade',
	fadeEffect: {
		crossFade: true,
	},
	speed: 600,
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

// Cases slider control
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

let videoJsModule;
let activePlayer;

sliderVideoTrigger.forEach((item) => {
	const defaultVideoSrc = item.querySelector('.vjs-cases-custom.video-js').currentSrc;
	item.dataset.defaultVideoSrc = defaultVideoSrc;

	item.addEventListener('click', () => {
		startVideo(item);
	});
});

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

casesSwiper.on('slideChange', (e) => {
	const currSlide =
		casesSwiper.slides[casesSwiper.previousIndex].querySelector('.cases-slide-item');

	stopVideo(currSlide);
});

function stopVideo(item) {
	item.classList.remove('video-active');

	if (activePlayer && !activePlayer.isDisposed()) {
		activePlayer.dispose();
	}
}

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

// showreel videos
const shwTriggers = document.querySelectorAll('.cases-item');
let currShw;

shwTriggers.forEach((item) => {
	item.addEventListener('click', (e) => {
		const shwSrc = e.currentTarget.dataset.videoSrc;

		if (!shwSrc || shwSrc === currShw) {
			return;
		}

		currShw = shwSrc;

		const currSlide =
			casesSwiper.slides[casesSwiper.activeIndex].querySelector('.cases-slide-item');

		const defVideoWrapper = currSlide.querySelector('.vjs-cases-wrapper');
		const defVidSrc = currSlide.dataset.defaultVideoSrc;

		stopVideo(currSlide);
		changeVideo(defVideoWrapper, shwSrc);
		startVideo(currSlide);

		casesSwiper.once('slideChangeTransitionEnd', () => {
			currShw = null;
			changeVideo(defVideoWrapper, defVidSrc);
		});
	});
});

function changeVideo(wrapper, src) {
	wrapper.innerHTML = `
			<video class="vjs-cases-custom video-js">
				<source
					src="${src}"
					type="video/mp4"
				/>
				<p>Your browser does not support HTML5 video</p>
			</video>`;
}
