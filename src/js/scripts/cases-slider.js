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
		// const slideIndex = target.dataset.slideToIndex;
		// casesSwiper.slideTo(+slideIndex);

		casesDotController(target);
	});
});

// casesSwiper.on('activeIndexChange', (e) => {
// 	const target = document.querySelector(`[data-slide-to-index="${e.activeIndex}"`);
// 	if (target) {
// 		casesDotController(target);
// 	}
// });

// Cases Video
const sliderVideoTrigger = document.querySelectorAll('.cases-slide-item');
let activePlayer;

sliderVideoTrigger.forEach((item) => {
	item.addEventListener('click', () => startVideo(item), {once: true});
});

function startVideo(item) {
	const videoEl = item.querySelector('.vjs-cases-custom');

	item.classList.add('video-active');

	loadVideojs()
		.then((videojs) => (activePlayer = setupSliderVideo(videojs, videoEl)))
		.then(() => {
			activePlayer.play();

			casesSwiper.once(
				'slideChangeTransitionEnd',
				() => {
					stopVideo(item);
				},
				{once: true}
			);
		})
		.catch((errorMessage) => {
			console.log('errorMessage: ', errorMessage);
			item.innerHTML = `<div class="custom-slider-error">${errorMessage}</div>`;
			// item.addEventListener('click', (e) => stopVideo(e, item));
		});
}

function stopVideo(item) {
	item.classList.remove('video-active');
	item.addEventListener('click', () => startVideo(item), {once: true});

	if (activePlayer) {
		activePlayer.dispose();
	}
}

function loadVideojs() {
	return import('video.js')
		.then(({default: videojs}) => {
			return videojs;
		})
		.catch((error) => {
			const errorMessage = 'Unable to load videoPlayer. ' + error.message;
			console.log(error);

			throw new Error(errorMessage);
		});
}

function setupSliderVideo(videojsModule, videoEl) {
	const activePlayer = videojsModule(videoEl, {
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

	return activePlayer;
}
