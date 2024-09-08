import 'normalize.css';
import 'video.js/dist/video-js.css';

import '../scss/video-js-style.scss';

import Swiper, {Pagination} from 'swiper';
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
import './scripts/cases-slider';
import './form/form-validation';

import './modules/swipe-controller';

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
const pricesSwiper = new Swiper('.prices-wrapper', {
	slidesPerView: 'auto',
	spaceBetween: 22,
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
		768: {
			spaceBetween: 28,
		},
		1700: {
			enabled: false,
		},
	},
	modules: [Pagination],
});
