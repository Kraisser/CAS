import 'normalize.css';
import 'video.js/dist/video-js.css';

import '../scss/video-js-style.scss';

import Swiper, {Navigation, Pagination, EffectFade} from 'swiper';
import 'swiper/scss';
import 'swiper/scss/effect-fade';

import '../scss/common/common.scss';

import '../scss/welcome-logo.scss';
import '../scss/cases.scss';
import '../scss/header.scss';
import '../scss/footer.scss';

import smoothScroll from './modules/smooth-scroll';
import activeLinksController from './modules/active-links-controller';
import menuDotCtrl from './modules/menu-dot-anim';

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

// Observer
const navSelectorList = [
	document.querySelector('.menu-list'),
	// document.querySelector('.main-burger-menu'),
];

const messengerWrapper = document.querySelector('.desc-messenger-wrapper');
const sliderCtrlWrapper = document.querySelector('.desc-slider-controls');

const casesCallback = (messengerWrapper, sliderCtrlWrapper) => {
	return (id) => {
		if (id === 'cases') {
			messengerWrapper.classList.add('hidden');
			sliderCtrlWrapper.classList.remove('hidden');
		} else {
			messengerWrapper.classList.remove('hidden');
			sliderCtrlWrapper.classList.add('hidden');
		}
	};
};

const switchingFooter = casesCallback(messengerWrapper, sliderCtrlWrapper);

const activeLinksControl = activeLinksController(navSelectorList, 'active', switchingFooter);

// DotController
const dot = document.querySelector('#desc-menu-dot');
const navWrapper = document.querySelector('.desc-menu-wrapper');
const dotCallback = menuDotCtrl(dot, navWrapper);
dotCallback();

// Smoothscroll
const smoothLinks = document.querySelectorAll('a[href^="#"]');
smoothScroll(smoothLinks, [activeLinksControl, dotCallback]);
