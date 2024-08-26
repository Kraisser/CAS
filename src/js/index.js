import 'normalize.css';
import 'video.js/dist/video-js.css';

import '../scss/video-js-style.scss';

import Swiper, {Navigation, Pagination, EffectFade, FreeMode} from 'swiper';
import 'swiper/scss';
import 'swiper/scss/effect-fade';

import '../scss/common/common.scss';

import '../scss/burger-menu.scss';
import '../scss/header.scss';
import '../scss/footer.scss';
import '../scss/welcome-logo.scss';
import '../scss/cases.scss';
import '../scss/testimonials.scss';
import '../scss/prices.scss';
import '../scss/contacts.scss';
import '../scss/modal.scss';

import './scripts/navigation';
import './scripts/modal';

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
		1200: {
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
		const slideIndex = target.dataset.slideToIndex;
		casesSwiper.slideTo(+slideIndex);

		casesDotController(target);
	});
});

casesSwiper.on('activeIndexChange', (e) => {
	const target = document.querySelector(`[data-slide-to-index="${e.activeIndex}"`);
	if (target) {
		casesDotController(target);
	}
});

//testimonials slider
new Swiper('.tnails-slides-wrapper', {
	slidesPerView: 'auto',
	speed: 600,
	spaceBetween: 32,
	grabCursor: true,
	initialSlide: 0,
	pagination: {
		el: '.tnails-slider-dots',
		type: 'bullets',
		bulletClass: 'tnails-slider-bullet',
		bulletActiveClass: 'tnails-slider-bullet-active',
		clickable: true,
	},
	breakpoints: {
		1200: {
			initialSlide: 1,
		},
	},
	modules: [Pagination],
});

// prices Slider
const pricesSwiper = new Swiper('.prices-slider-wrapper', {
	slidesPerView: 'auto',
	spaceBetween: 28,
	speed: 600,
	grabCursor: true,
	enabled: true,
	pagination: {
		el: '.prices-slider-dots',
		type: 'bullets',
		bulletClass: 'prices-slider-bullet',
		bulletActiveClass: 'prices-slider-bullet-active',
		clickable: true,
	},
	breakpoints: {
		1700: {
			enabled: false,
		},
	},
	modules: [Pagination],
});
