import 'normalize.css';
import 'video.js/dist/video-js.css';

import '../scss/video-js-style.scss';

import Swiper, {Navigation, Pagination, EffectFade} from 'swiper';
import 'swiper/scss';
import 'swiper/scss/effect-fade';

import '../scss/common/common.scss';

import '../scss/header.scss';
import '../scss/footer.scss';
import '../scss/welcome-logo.scss';
import '../scss/cases.scss';
import '../scss/testimonials.scss';
import '../scss/prices.scss';
import '../scss/contacts.scss';

import './scripts/navigation';

// Cases Slider
new Swiper('.cases-slider', {
	slidesPerView: 1,
	effect: 'fade',
	speed: 600,
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
	modules: [Navigation, Pagination, EffectFade],
	loop: true,
});

//testimonials slider
new Swiper('.tnails-slider-wrapper', {
	slidesPerView: 2.5,
	speed: 600,
	spaceBetween: 32,
	grabCursor: true,
	initialSlide: 1,
	// loop: true,
});
