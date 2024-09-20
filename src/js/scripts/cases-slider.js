import Swiper, {Navigation, Pagination, EffectFade} from 'swiper';

// plb Posters
import lastHeroPoster from '../../assets/plb-posters/last_hero.webp';
import shopExpancePoster from '../../assets/plb-posters/shop_expanse.webp';
import carOutPoster from '../../assets/plb-posters/car_out.webp';

// Flags variables
let videoJsModule;
let activePlayer;
let currShw;
let plbActive;

// Cases Slider
const casesSwiper = new Swiper('.cases-slider', {
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

sliderVideoTrigger.forEach((item) => {
	const defaultVideoSrc = item.querySelector('.vjs-cases-custom.video-js').currentSrc;
	item.dataset.defaultVideoSrc = defaultVideoSrc;

	item.addEventListener('click', () => {
		startVideo(item);
	});
});

function startVideo(item) {
	if ((activePlayer && !activePlayer.isDisposed()) || plbActive) {
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

function slideDefault() {
	const currSlide =
		casesSwiper.slides[casesSwiper.previousIndex].querySelector('.cases-slide-item');
	const defVideoWrapper = currSlide.querySelector('.vjs-cases-wrapper');
	const defVidSrc = currSlide.dataset.defaultVideoSrc;

	stopVideo(currSlide);

	if (currShw) {
		changeVideo(defVideoWrapper, defVidSrc);
		currShw = null;
	}

	plbRemove(currSlide);
}

function plbRemove(currSlide) {
	if (plbActive) {
		const plbWrapper = currSlide.querySelector('.plb-wrapper');
		currSlide.classList.remove('plb-active');

		if (plbWrapper) {
			plbWrapper.remove();
		}

		plbActive = false;
	}
}

casesSwiper.on('slideChange', slideDefault);

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

shwTriggers.forEach((item) => {
	item.addEventListener('click', initShowreel);
});

function initShowreel(e) {
	const shwSrc = e.currentTarget.dataset.videoSrc;

	if (!shwSrc || shwSrc === currShw) {
		return;
	}

	currShw = shwSrc;

	const currSlide = casesSwiper.slides[casesSwiper.activeIndex].querySelector('.cases-slide-item');
	const defVideoWrapper = currSlide.querySelector('.vjs-cases-wrapper');

	plbRemove(currSlide);
	stopVideo(currSlide);
	changeVideo(defVideoWrapper, shwSrc);
	startVideo(currSlide);
}

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

// Playable ads
const plbTrigger = document.querySelector('#playable-trigger');

plbTrigger.addEventListener('click', plbInit);

function plbInit() {
	if (plbActive) {
		return;
	}

	plbActive = true;

	const currSlide = casesSwiper.slides[casesSwiper.activeIndex].querySelector('.cases-slide-item');
	const defVideoWrapper = currSlide.querySelector('.vjs-cases-wrapper');
	const defVidSrc = currSlide.dataset.defaultVideoSrc;

	currSlide.classList.add('plb-active');

	currShw = null;

	stopVideo(currSlide);
	changeVideo(defVideoWrapper, defVidSrc);

	currSlide.insertAdjacentHTML(
		'afterbegin',
		`
		<div class="plb-wrapper">
			<a class="plb-icon" href="./playables/last-hero.html" target="_blank" rel="noopener noreferrer">
				<img src="${lastHeroPoster}" alt="lastHero">
			</a>
			<a class="plb-icon" href="./playables/car_out.html" target="_blank" rel="noopener noreferrer">
				<img src="${carOutPoster}" alt="Car Out">
			</a>
			<a class="plb-icon" href="./playables/shop_expanse.html" target="_blank" rel="noopener noreferrer">
				<img src="${shopExpancePoster}" alt="Shop Expanse">
			</a>
			<a class="plb-icon" href="./playables/last-hero.html" target="_blank" rel="noopener noreferrer">
				<img src="${lastHeroPoster}" alt="lastHero">
			</a>
			<a class="plb-icon" href="./playables/last-hero.html" target="_blank" rel="noopener noreferrer">
				<img src="${lastHeroPoster}" alt="lastHero">
			</a>
		</div>
		`
	);
}
